import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, TablePagination, Stack, Box, styled, Slider, Tooltip, Button } from '@mui/material';
import { useState, useMemo, useEffect, useRef } from 'react';
import { Storage } from 'aws-amplify';
import axios from 'axios';
import { useGetScriptRecordingsLazyQuery, useDeleteRecordingMutation } from '../../generated/graphql';
import AudioRecorder from '../../components/AudioRecorder';
import { Pause, PlayArrow, VolumeDown, VolumeUp } from '@mui/icons-material';

interface Column {
    id: 'name' | 'time_saved' | 'audio_url' | 'delete';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
  
const columns: readonly Column[] = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'time_saved', label: 'Time Saved', minWidth: 100 },
    { id: 'audio_url', label: 'Audio URL', minWidth: 100 },
    { id: 'delete', label: 'Delete', minWidth: 100 },
];
  
interface Recording {
    name: string;
    time_saved: string;
    audio_url: string;
    delete: string;
}
  
function createRecording(
    name: string,
    time_saved: string,
    audio_url: string
  ): Recording {
    return { name, time_saved, audio_url, delete: "X" };
  }
  

export default function RecordingsPage() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const url = window.location.search;
    const searchParams = useMemo(() => new URLSearchParams(url), [url]);
    const title = useMemo(() => searchParams.get('title'), [searchParams]);
    const scriptid = useMemo(() => searchParams.get('scriptid'), [searchParams]);
    const [recordings, setRecordings] = useState([] as Recording[]);
      // for audio player
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioUrl, setAudioUrl] = useState<string>();
    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsed, setElapsed] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [selectedRecording, setSelectedRecording] = useState<Recording>();

    const [fetchScriptCollaborators, { data, refetch: refetchScriptCollaborators }] = useGetScriptRecordingsLazyQuery();
    const [deleteRecordingMutation] = useDeleteRecordingMutation();

    useEffect(() => {
        fetchScriptCollaborators({
            variables: {
                title: title || '',
                userid: localStorage.getItem('userid') || '',
            }
        });
    }, []);

    useEffect(() => {
        const fetchRecordings = async () => {
          const fetchedRecordings = [];
          if (data?.getScriptRecordings) {
            for (let i = 0; i < data.getScriptRecordings.length; i++) {
              const recording = data.getScriptRecordings[i];
              const name = recording?.title;
              const time_saved = recording?.time_saved;
              const userid = localStorage.getItem('userid');
              const fileName = "userid-" + userid + "/scriptid-" + scriptid + "/recordings/" + recording?.title + ".wav";
              const audio = await Storage.get(fileName, { download: true });
      
              if (audio.Body) {
                const blob = new Blob([audio.Body], { type: "audio/wav" });
                const audioUrl = URL.createObjectURL(blob);
                console.log("Audio URL:", audioUrl);
                fetchedRecordings.push(createRecording(name || '', time_saved || '', audioUrl));
              }
            }
          }
          setRecordings(fetchedRecordings);
        };
      
        fetchRecordings(); // Fetch the recordings when the component mounts or when data changes
      }, [data]);

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    var getDuration = function (url: any, next: any) {
      var _player = new Audio(url);
      _player.addEventListener("durationchange", function (e) {
          if (this.duration!=Infinity) {
            var duration = this.duration
            _player.remove();
            next(duration);
          };
      }, false);      
      _player.load();
      _player.currentTime = 24*60*60;
      _player.volume = 0;
    };

    useEffect(() => {
      getDuration (audioUrl, function (duration: any) {
        setDuration(duration)
    });
    }, [audioUrl]);

    const changeSelectedAudio = (row: Recording) => {
        audioRef.current?.pause();
        setIsPlaying(false);
        setAudioUrl(row.audio_url);
        if(audioRef.current)
            audioRef.current.src = row.audio_url;
        setSelectedRecording(row);
    }
  
    interface sliderProps {
      theme?: any;
      thumbless?: boolean;
    }
  
    const PlayBar = styled(Slider)<sliderProps>(({ theme, ...otherProps }) => ({
      color: 'silver',
      height: 2,
      '&:hover': {
        cursor: 'auto',
      },
      '& .MuiSlider-thumb': {
        width: '14px',
        height: '14px',
        display: otherProps.thumbless ? 'none' : 'block'
      }
    }))

    const MyVolSliderTag = () => {
        const [volume, setVolume] = useState(70);
        const handleVolume = (e: Event, newValue: number | number[]): void => {
          // const { value } = e.target;
          let currVolume = Number(newValue);
          if(audioRef.current) {
            audioRef.current.volume = currVolume / 100;
            setVolume(currVolume);
          }
        }
    
        return (
          <Box sx={{backgroundColor: '#f1efee'}}>
            <Stack direction='row' spacing={1}
                sx={{
                  display : 'flex',
                  justifyContent: 'flex-start',
                  width: '70%',
                  alignItems: 'center',
                }}>         
                <VolumeDown />
                <PlayBar
                  min={0}
                  max={100}
                  value={volume}
                  onChange={handleVolume}
                  defaultValue={70}
                  />
                <VolumeUp />
            </Stack>
          </Box>
        );
      }
    
      const togglePlay = () => {
        if(selectedRecording) {
          if(!isPlaying) {
            audioRef.current?.play();
          }
          else {
            audioRef.current?.pause();
          }
          setIsPlaying(!isPlaying);
        }
      }
    
      const onTimeUpdate = () => {
        if (audioRef.current) {
          setElapsed(audioRef.current.currentTime);
        }
      };

      const formatTime = (time: number) => {
        if(time && !isNaN(time) && isFinite(time)) {
          const minutes = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60);
          const seconds = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60);
    
          return `${minutes}:${seconds}`;
        }
        return "00:00";
      }
      const styledPaper = {
        backgroundColor: 'black',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      };

      const deleteRecording = async (row: Recording) => {
        const fileName = "userid-" + localStorage.getItem('userid') + "/scriptid-" + scriptid + "/recordings/" + row.name + ".wav";
        await Storage.remove(fileName);
        await deleteRecordingMutation({
          variables: {
            title: row.name,
            scriptid: scriptid || '',
          }
        });
        refetchScriptCollaborators({
            title: title || '',
            userid: localStorage.getItem('userid') || '',
        });
      }

      const handleItemClick = (row: Recording, column: Column) => {
        if(column.id === 'delete') {
          deleteRecording(row);
        }
        else {
          changeSelectedAudio(row)
        }
      }

      const goToEditingPage = () => {
        window.location.href = "/Editing?title=" + title + "&scriptid=" + scriptid;
      }

    if(scriptid && recordings!==undefined) {
        return (
            <>
            <Box sx={{ flexWrap: 'wrap', display: 'flex', bgcolor: 'black', width: '100%', minHeight: '100vh' }}>
                <Paper sx={styledPaper}>
                  <Typography sx={{color: 'silver'}}>{selectedRecording?.name || 'Select a recording to playback'}</Typography>
                  <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Stack direction='row' spacing={1}
                      sx={{
                        display : 'flex',
                        justifyContent: 'center',
                        width: '40%',
                        alignItems: 'center',
                      }}>
                        <Tooltip title="Play/Pause">
                          {!isPlaying ? (<PlayArrow onClick={togglePlay} sx={{
                                        fontSize: '80px',
                                        color:'silver',
                                        '&:hover': {color: 'white'}}}
                                      />)
                                      : (<Pause onClick={togglePlay} sx={{
                                        fontSize: '80px',
                                        color:'silver',
                                        '&:hover': {color: 'white'}}}/>)
                                      }
                        </Tooltip>
                    </Stack>
                  </Box>
                  <Stack spacing={1} direction='row' sx={{
                    display : 'flex',
                    width: '100%',
                    alignItems: 'center',
                  }}>
                  <Typography sx={{color: 'silver'}}>{formatTime(elapsed)}</Typography>
                  <PlayBar thumbless value={elapsed} max={duration} onChange={(e, newValue) => {
                    if(audioRef.current)
                      audioRef.current.currentTime = newValue as number;
                  }
                  }/>
                  <Typography sx={{color: 'silver'}}>{formatTime(duration - elapsed)}</Typography>
                  </Stack>
                  <MyVolSliderTag />
                  <audio 
                    className='my-audio' 
                    src={audioUrl}
                    ref={audioRef} 
                    onTimeUpdate={onTimeUpdate}>
                  </audio>
                  <Button onClick={goToEditingPage}>Return to Script</Button>
                </Paper>

                <Typography variant="h4"> Recordings </Typography>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                            >
                                {column.label}
                            </TableCell>
                            ))}
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {recordings
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1}>
                                {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                    <TableCell key={column.id} align={column.align} onClick={() => handleItemClick(row, column)}>
                                        {column.format && typeof value === 'number'
                                        ? column.format(value)
                                        : value}
                                    </TableCell>
                                    );
                                })}
                                </TableRow>
                            );
                            })}
                        </TableBody>
                    </Table>
                    </TableContainer>
                    <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={-1}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
                </Box>
            </>
        );
    }
    else {
        return (
            <>
            </>
        );
    }
}