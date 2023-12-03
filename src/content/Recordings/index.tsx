import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, TablePagination, Stack, Box, Alert, Snackbar, Fab, Grow, Modal, Grid } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import { useGetScriptRecordingsLazyQuery, useDeleteRecordingMutation } from '../../generated/graphql';
import AudioRecorder from '../../components/AudioRecorder';
import { Check, Close, KeyboardReturn } from '@mui/icons-material';

// MUI table interface
interface Column {
    id: 'name' | 'time_saved' | 'audio_url' | 'delete';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}
  
const columns: readonly Column[] = [
    { id: 'delete', label: '', minWidth: 10 },
    { id: 'name', label: 'Recording Name', minWidth: 170 },
    { id: 'time_saved', label: 'Time Saved', minWidth: 100 },
];
  
// all recording info for table and playback
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
    return { name, time_saved, audio_url, delete: "Delete" };
  }
  

export default function RecordingsPage() {
  // for table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // for recordings retrieval on UI
  const url = window.location.search;
  const searchParams = useMemo(() => new URLSearchParams(url), [url]);
  const title = useMemo(() => searchParams.get('title'), [searchParams]);
  const scriptid = useMemo(() => searchParams.get('scriptid'), [searchParams]);
  const [recordings, setRecordings] = useState([] as Recording[]);
  const [selectedRecording, setSelectedRecording] = useState<Recording>();
  
  // for notifications
  const [notificationText, setNotificationText] = useState<string>();
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [notificationSeverity, setNotificationSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // for backend call to get recordings and delete recordings
  const [fetchScriptCollaborators, { data, refetch: refetchScriptCollaborators }] = useGetScriptRecordingsLazyQuery();
  const [deleteRecordingMutation] = useDeleteRecordingMutation();

  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '40%',
    left: '40%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    margin: 'auto',
  };

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
            // get recording from s3
            const audio = await Storage.get(fileName, { download: true });
    
            if (audio.Body) {
              const blob = new Blob([audio.Body], { type: "audio/wav" });
              const audioUrl = URL.createObjectURL(blob);
              // add recording to table
              fetchedRecordings.push(createRecording(name || '', time_saved || '', audioUrl));
            }
          }
        }
        setRecordings(fetchedRecordings);
      };
    
      fetchRecordings(); // Fetch the recordings when the component mounts or when data changes
    }, [data]);

  // helper functions for recordings table
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

  const deleteRecording = async () => {
    if(selectedRecording) {
      const fileName = "userid-" + localStorage.getItem('userid') + "/scriptid-" + scriptid + "/recordings/" + selectedRecording.name + ".wav";
      // remove audio recording from S3 and inform backend that it was deleted
      await Storage.remove(fileName);
      await deleteRecordingMutation({
        variables: {
          title: selectedRecording.name,
          scriptid: scriptid || '',
        }
      });
      // refresh the table and available recordings
      refetchScriptCollaborators({
          title: title || '',
          userid: localStorage.getItem('userid') || '',
      });
      setModalOpen(false);
      deselectAudio();
    }
  }

  // helper functions to select and deselect audio
  const deselectAudio = () => {
    setSelectedRecording(undefined);
  }

  const handleItemClick = (row: Recording, column: Column) => {
    if(column.id === 'delete') {
      changeSelectedAudio(row);
      setModalOpen(true);
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
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Grow in={modalOpen} timeout={750}>
              <Box sx={modalStyle}>
                <Typography sx={{ textAlign: 'center', marginBottom: '5%'}}>{"Are you sure you want to delete this recording?"}</Typography>
                <Stack direction='row' spacing={2} justifyContent={'center'}>
                  <Fab variant='extended' onClick={deleteRecording} sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: '#ff7276' } }}><Check />Yes</Fab>
                  <Fab variant='extended' onClick={() => setModalOpen(false)}><Close />No</Fab>
                </Stack>
              </Box>
            </Grow>
          </Modal>
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
          <div style={{ flexGrow: 1, backgroundColor: '#f1efee' }}>
              <Grid sx={{ flexGrow: 1}} container justifyContent="center" >
                  <Grow in key='PlaybackPane' timeout={1000}>
                    <Paper elevation={0} sx={{
                      height: window.innerHeight * 0.1,
                      width: window.innerWidth * 0.3,
                      backgroundColor: '#f1efee',
                      justifyContent: 'center',
                      marginTop: "2%",
                      }}>
                        <Stack direction='column' spacing={2}>
                          <AudioRecorder scriptid={scriptid} recordingTitle={selectedRecording?.name || 'Select a recording to playback.'} onShowNotification={showNotification} mode='Viewing' viewingAudioUrl={selectedRecording?.audio_url || ''}/>
                          <Fab variant='extended' onClick={goToEditingPage}><KeyboardReturn/>Return to Script</Fab>
                        </Stack>
                    </Paper>
                  </Grow>

                  <Grow in timeout={1500}>
                    <Paper sx={{ width: '60%', overflow: 'hidden', margin: '15% 10% 10% 10%' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                        <Table aria-label="recordings table">
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
                                          {column.id === 'delete' ? (
                                            <Fab size='small' variant='extended' sx={{ marginLeft: '25%', marginTop: '-1%',backgroundColor: 'red', '&:hover': { backgroundColor: '#ff7276' } }}><Close />Delete</Fab>
                                          ) : (
                                            column.format && typeof value === 'number' ? column.format(value) : value
                                          )}
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
                        rowsPerPageOptions={[5, 10]}
                        component="div"
                        count={-1}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                  </Grow>
              </Grid>
          </div>
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