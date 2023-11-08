import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, TablePagination, Stack, Box, styled, Slider, Tooltip, Button, Alert, Snackbar } from '@mui/material';
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

    const [selectedRecording, setSelectedRecording] = useState<Recording>();
    const [notificationText, setNotificationText] = useState<string>();
    const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
    const [notificationSeverity, setNotificationSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');

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
   
    const changeSelectedAudio = (row: Recording) => {
        setSelectedRecording(row);
    }

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

      const showNotification = (severity: 'success' | 'info' | 'warning' | 'error', text: string) => {
        setNotificationSeverity(severity);
        setNotificationText(text);
        setIsNotificationOpen(true);
    }

    if(scriptid && recordings!==undefined) {
        return (
            <>
            <Snackbar
              open={isNotificationOpen}
              autoHideDuration={6000}
              onClose={() => setIsNotificationOpen(false)}
              >
              <Alert
                  onClose={() => setIsNotificationOpen(false)}
                  severity={notificationSeverity}
                  sx={{ width: '100%' }}
              >
                  {notificationText}
              </Alert>
            </Snackbar>
            <Box sx={{ flexWrap: 'wrap', display: 'flex', bgcolor: 'black', width: '100%', minHeight: '100vh' }}>
                <Paper>
                  <AudioRecorder scriptid={scriptid} recordingTitle={selectedRecording?.name} onShowNotification={showNotification} mode='Viewing' viewingAudioUrl={selectedRecording?.audio_url}/>
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