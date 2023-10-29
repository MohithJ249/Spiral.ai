import React, { useState, useEffect, useRef } from 'react';
import { Storage } from 'aws-amplify';
import { Box, Button, Card, CardContent, CardMedia, IconButton, Input, Paper, Slider, Stack, Tooltip, Typography, styled  } from '@mui/material';
import { Pause, PlayArrow, NotStarted, RecordVoiceOver, StopCircle, Save, VolumeUp, VolumeDown, Waves } from '@mui/icons-material';
import { useSaveRecordingMutation } from '../generated/graphql';
import { time } from 'console';

interface AudioRecorderProps {
  scriptid: string;
  onShowNotification: (severity: 'success' | 'info' | 'warning' | 'error', text: string) => void;
}

function AudioRecorder({ scriptid, onShowNotification }: AudioRecorderProps) {
  const [stream, setStream] = useState<MediaStream>();
  const [recording, setRecording] = useState(false);
  const [recordingName, setRecordingName] = useState<string>();
  const [audioUrl, setAudioUrl] = useState<string>();
  const mediaRecorderRef = useRef<MediaRecorder>();
  const audioChunks = useRef<Blob[]>([]);
  const [saveRecordingInDatabase, { loading, error }] = useSaveRecordingMutation();

  // for audio player
  const [volume, setVolume] = useState<number>(80);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState<string | undefined>('00:00');
  const [duration, setDuration] = useState<string | undefined>('00:00');

  useEffect(() => {
    if (recording) {
      startRecording();
    } else {
      stopRecording();
    }
  
    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60);
      const seconds = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60);
  
      if (Number.isNaN(minutes) || Number.isNaN(seconds)) return '00:00';
  
      return `${minutes}:${seconds}`;
    }
  
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        const currDuration: number = Math.floor(audioRef.current.duration);
        const currElapsed: number = Math.floor(audioRef.current.currentTime);
        console.log(formatTime(currDuration), '/', currDuration, ':::', formatTime(currElapsed), '/', currElapsed);
        setDuration(formatTime(currDuration));
        setElapsed(formatTime(currElapsed));
      }
    }
  
    if (audioRef.current) {
      // Listen for the 'loadedmetadata' event
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    }
  
    // Clean up the event listener when the component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, [recording]);
  

  const startRecording = async () => {
    try {
        audioChunks.current = [];
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(stream);
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorderRef.current.ondataavailable = (e: BlobEvent) => {
            if (e.data.size > 0) {
                audioChunks.current.push(e.data);
            }
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
            setAudioUrl(URL.createObjectURL(audioBlob));
        };

        mediaRecorderRef.current.start();
    } catch (error) {
        console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if(stream)
        stream.getTracks().forEach((track) => track.stop());
    }
  };

  const saveRecording = () => {
    if(recordingName) {
      // First save recording to database to ensure no duplicate names
      saveRecordingInDatabase({
        variables: {
          scriptid: scriptid,
          title: recordingName,
        }
      }).then(() => {
        // Save recording to S3
        const userid = localStorage.getItem('userid');
        const fileName = "userid-"+userid+ "/scriptid-" + scriptid + "/recordings/"+recordingName+".wav";
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        Storage.put(fileName, audioBlob, {
          contentType: 'audio/wav',
          level: 'public',
        }).then(() => {
          setRecordingName('');
          setAudioUrl('');         
          onShowNotification('success', 'Recording saved successfully.'); 
        }).catch((error) => {
          onShowNotification('error', 'Error saving recording: ' + error.message);
        });
      }).catch((error) => {
        if(error.message.includes('duplicate key value violates unique constraint "uq_scriptid_title"'))
          onShowNotification('error', 'A recording with that name already exists. Please choose a different name.');
      });
    }
  }

  const saveRecordingDisabled = () => {
    return !audioUrl || recordingName === undefined || recordingName === '' || loading;
  }

  // styling audio player

  const styledDiv = {
    height: '100%',
    width: '100%',
    paddingTop: '6px',
  }

  interface paperProps {
    theme?: any;
  }

  
  const styledPaper = {
    backgroundColor: '#4d4d4d',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  };

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

    // const handleVolChange = (event: React.SyntheticEvent | Event, newValue: number | number[]) => {
    //   const inputElement = event.target as HTMLInputElement;
    //   const value = inputElement.value;
    //   const newVolume = Number(value);
    //   console.log(newVolume);
    //   if (audioRef.current) {
    //     audioRef.current.volume = newVolume / 100;
    //   }
    //   setVolume(newVolume);
    // };
    // const handleVolume = (e: React.ChangeEvent<HTMLInputElement> | React.SyntheticEvent | Event): void => {
    //   const inputElement = e.target as HTMLInputElement;
    //   const value = inputElement.value;
    //   const volume = Number(value) / 100;
    //   setVolume(volume);
    //   if(audioRef.current)
    //     audioRef.current.volume = volume;
    // }

    const handleVolume = (e: Event, newValue: number | number[]): void => {
      // const { value } = e.target;
      const volume = Number(newValue) / 100;
      if(audioRef.current)
        audioRef.current.volume = volume;
    }

    return (
      <Box sx={{ width: 200 }}>
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
              onChange={handleVolume}
              defaultValue={70}
            />
            <VolumeUp />
        </Stack>
      </Box>
    );
  }

  const togglePlay = () => {
    if(!isPlaying) {
      audioRef.current?.play();
    }
    else {
      audioRef.current?.pause();
    }
    setIsPlaying(!isPlaying);
  }


  return (
    <>
      <Paper sx={styledPaper}>
        <Stack direction='row' spacing={1} sx={{
          justifyContent: 'center'}}>
          <Input placeholder="Recording Name" value={recordingName} onChange={(e) => setRecordingName(e.target.value)} />
        </Stack>
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Stack direction='row' spacing={1}
            sx={{
              display : 'flex',
              justifyContent: 'center',
              width: '40%',
              alignItems: 'center',
            }}>
              <Tooltip title="Record">
                <RecordVoiceOver sx={{
                  color:'silver',
                  '&:hover': {color: 'white'}}}
                              onClick={() => setRecording(!recording)}/>
              </Tooltip>

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

              <Tooltip title="Save">
                <span>
                  <IconButton onClick={saveRecording} disabled={saveRecordingDisabled()}>
                    <Save sx={{color:'silver', '&:hover': {color: 'white'}}}/>
                  </IconButton>
                </span>
              </Tooltip>
          </Stack>
        </Box>
        <Stack spacing={1} direction='row' sx={{
          display : 'flex',
          width: '100%',
          alignItems: 'center',
        }}>
          <Typography sx={{color: 'silver'}}>{elapsed}</Typography>
          <PlayBar thumbless/>
          <Typography sx={{color: 'silver'}}>{duration}</Typography>
        </Stack>
        <MyVolSliderTag />
        <audio className='my-audio' src={audioUrl} ref={audioRef}></audio>
      </Paper>

    {/* <div>
      <Card sx={{ display: 'flex' , justifyContent: 'center', borderRadius: '10px' }}>
        <Box sx={{ flexDirection: 'column', margin: '20px' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
            <Input placeholder="Recording Name" value={recordingName} onChange={(e) => setRecordingName(e.target.value)} />
          </CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', pl: 1, pb: 1 }}>
            <IconButton aria-label="play/pause">
              <RecordVoiceOver sx={{ height: 38, width: 38 }} onClick={() => setRecording(!recording)}/>
            </IconButton>
            <IconButton aria-label="save" onClick={saveRecording} disabled={saveRecordingDisabled()}>
              <Save sx={{ height: 38, width: 38 }} />
            </IconButton>
          </Box>
          <audio controls src={audioUrl}/> 
        </Box>
      </Card>
    </div> */}
    </>
  );
}

export default AudioRecorder;