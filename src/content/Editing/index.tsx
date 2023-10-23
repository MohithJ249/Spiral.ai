import { Button, Grid, Grow, Paper, TextField, Typography, recomposeColor, Snackbar, Alert } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import { useDeleteScriptMutation, useGetScriptVersionsQuery, useGetScriptRecordingsQuery } from '../../generated/graphql';
import AudioRecorder from '../../components/AudioRecorder';
import MakeVersionButton from '../../components/MakeVersionButton';

export default function EditingPage() {
    const url = window.location.search;
    const searchParams = useMemo(() => new URLSearchParams(url), [url]);
    const title = useMemo(() => searchParams.get('title'), [searchParams]);
    const scriptid = useMemo(() => searchParams.get('scriptid'), [searchParams]);

    const [scriptContent, setScriptContent] = useState<string>();
    const [isSavingScript, setIsSavingScript] = useState<boolean>(false);
    const [notificationText, setNotificationText] = useState<string>();
    const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
    const [notificationSeverity, setNotificationSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');
    const [selectedTextPosition, setSelectedTextPosition] = useState<[number, number] | undefined>(undefined);

    const [deleteScriptMutation] = useDeleteScriptMutation();
    const { data: scriptRecordingsData } = useGetScriptRecordingsQuery({
        variables: {
            userid: localStorage.getItem('userid') || '',
            title: title || ''
        }
    });
    const { data: scriptVersionsData } = useGetScriptVersionsQuery({
        variables: {
            scriptid: scriptid || ''
        }
    });

    useEffect(() => {
        populateScriptContent();
    }, []);

    // Add ctrl+s shortcut to save script
    useEffect(() => {
        const handleSave = (e: any) => {
          if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveScript();
          }
        };
    
        document.addEventListener('keydown', handleSave);
    
        return () => {
          document.removeEventListener('keydown', handleSave);
        };
      }, [scriptContent]);

    const saveScript = () => {
        if(!isSavingScript) {
            setIsSavingScript(true);
            const userid = localStorage.getItem('userid');
            const fileName = "userid-"+userid+ "/scriptid-" + scriptid + "/"+title+".txt";
            Storage.put(fileName, scriptContent || '', {
                contentType: 'text/plain'
            }).then(() => {
                showNotification('success', 'Script saved successfully!');
            }).catch(() => {
                showNotification('error', 'Error saving script, please try again.');
            }).finally(() => {
                setIsSavingScript(false);
            });
        }
    }

    const showNotification = (severity: 'success' | 'info' | 'warning' | 'error', text: string) => {
        setNotificationSeverity(severity);
        setNotificationText(text);
        setIsNotificationOpen(true);
    }

    const populateScriptContent = () => {
        const userid = localStorage.getItem('userid');
        const fileName = "userid-"+userid+ "/scriptid-" + scriptid + "/"+title+".txt";

        Storage.get(fileName, { download: true })
            .then(fileContent => {
                return fileContent.Body?.text();
            })
            .then(textContent => {
                setScriptContent(textContent || '');
            })
            .catch(error => {
                console.error('Error downloading file:', error);
        });      
    }

    const deleteScript = async () => {
        if(scriptVersionsData) {
            scriptVersionsData.getScriptVersions?.forEach(async version => {
                await Storage.remove("userid-"+localStorage.getItem('userid')+"/scriptid-"+scriptid+"/versions/"+version?.versionid+".txt");
            });
        }

        if(scriptRecordingsData) {
            scriptRecordingsData.getScriptRecordings?.forEach(async recording => {
                await Storage.remove("userid-"+localStorage.getItem('userid')+"/scriptid-"+scriptid+"/recordings/"+recording?.recordingid+".wav");
            });
        }

        await Storage.remove("userid-"+localStorage.getItem('userid')+"/scriptid-"+scriptid+"/"+title+".txt");

        deleteScriptMutation({
            variables: {
                scriptid: scriptid || ''
            }
        }).then(() => {
            window.location.href = '/MyScripts';
        }).catch(() => {
            showNotification('error', 'Error deleting script, please try again.');
        });
    }

    const selectText = () => {
        const textField = document.getElementById('outlined-multiline-static') as HTMLInputElement;
      
        if (textField) {
          const selectionStart = textField.selectionStart;
          const selectionEnd = textField.selectionEnd;
      
            if(scriptContent && selectionStart && selectionEnd)
            {
                setSelectedTextPosition([selectionStart, selectionEnd]);
            }
        }
    }

    const handleReplaceText = () => {      
        if (selectedTextPosition) {
          const selectionStart = selectedTextPosition[0];
          const selectionEnd = selectedTextPosition[1];
      
          if(scriptContent) {
            const newText = scriptContent.slice(0, selectionStart) + 'hello' + scriptContent.slice(selectionEnd);
            setScriptContent(newText);
          }
        }
    }

    if(scriptid && title !== undefined && scriptContent !== undefined) {
        return (
            <>
                <div>
                    <Snackbar open={isNotificationOpen} autoHideDuration={6000} onClose={()=>setIsNotificationOpen(false)}>
                        <Alert onClose={()=>setIsNotificationOpen(false)} severity={notificationSeverity} sx={{ width: '100%' }}>
                            {notificationText}
                        </Alert>
                    </Snackbar>
                    <Typography variant="h3">Script: {title}</Typography>

                    <div style={{ flexGrow: 1 }}>
                        <Grid sx={{ flexGrow: 1 }} container spacing={2}>
                            <Grid item xs={12}>
                                <Grid container justifyContent="center" spacing={2}>
                                    <Grow in key='RecordingPane' timeout={1000}>
                                        <Grid item>
                                            <Paper
                                                sx={{
                                                height: window.innerHeight * 0.8,
                                                width: window.innerWidth * 0.2,
                                                backgroundColor: '#eeeeee',
                                                }}
                                            >
                                                
                                                <AudioRecorder scriptid={scriptid}/>
                                                <Button onClick={saveScript} disabled={isSavingScript}>
                                                    Save Script
                                                </Button>
                                                <MakeVersionButton scriptid={scriptid} scriptContent={scriptContent} onShowNotification={showNotification} />
                                                <Button onClick={() => window.location.href = '/VersionHistory?scriptid='+scriptid+'&title='+title}>
                                                    See Version History
                                                </Button>
                                                <Button color='error' onClick={deleteScript}>
                                                    Delete Script
                                                </Button>

                                            </Paper>
                                        </Grid>
                                    </Grow>

                                    <Grow in key='EditingPane' timeout={1500}>
                                        <Grid item>
                                            <TextField
                                            id="outlined-multiline-static"
                                            multiline
                                            // height of 1 row = 56px, so adjust accordingly
                                            rows={window.innerHeight * 0.8 / 24}
                                            variant="outlined"
                                            sx={{
                                                height: window.innerHeight * 0.8,
                                                width: window.innerWidth * 0.5,
                                            }}
                                            value={scriptContent}
                                            onChange={(e) => setScriptContent(e.target.value)}
                                            />
                                        </Grid>
                                    </Grow>

                                    <Grow in key='LLMPane' timeout={1000}>
                                        <Grid item>
                                            <Paper
                                                sx={{
                                                height: window.innerHeight * 0.8,
                                                width: window.innerWidth * 0.2,
                                                backgroundColor: '#eeeeee',
                                                }}
                                            >
                                                <TextField
                                                    id='selected-text'
                                                    value={selectedTextPosition ? scriptContent?.slice(selectedTextPosition[0], selectedTextPosition[1]) : ''}
                                                    multiline
                                                    disabled
                                                />
                                                <Button onClick={handleReplaceText}>
                                                    Replace Text
                                                </Button>
                                                
                                                <Button onClick={selectText}>
                                                    Select Text
                                                </Button>
                                            </Paper>
                                        </Grid>
                                    </Grow>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </>
        );
    }
    else {
        return <></>
    }
}