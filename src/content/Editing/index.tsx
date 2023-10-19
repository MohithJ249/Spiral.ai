import { Button, Grid, Grow, Paper, TextField, Typography, recomposeColor, Snackbar, Alert } from '@mui/material';
import { ReactMediaRecorder, ReactMediaRecorderRenderProps } from 'react-media-recorder';
import { useParams } from 'react-router';
import { useState, useMemo, useEffect } from 'react';
import { preProcessFile } from 'typescript';
import { Storage } from 'aws-amplify';
import AudioRecorder from '../../components/audio';
import { v4 as uuidv4 } from 'uuid';
import { useCreateScriptVersionMutation } from '../../generated/graphql';

export default function EditingPage() {
    const [title, setTitle] = useState<string>();
    const [scriptid, setScriptid] = useState<string>();
    const [scriptContent, setScriptContent] = useState<string>();
    const [createScriptVersion] = useCreateScriptVersionMutation();
    const [isSavingVersion, setIsSavingVersion] = useState<boolean>(false);
    const [versionErrorOpen, setVersionErrorOpen] = useState<boolean>(false);
    const [versionSuccessOpen, setVersionSuccessOpen] = useState<boolean>(false);

    function populateScriptContent() {
        const userid = localStorage.getItem('userid');
        const fileName = "userid-"+userid+ "/scriptid-" + scriptid + "/"+title+".txt";

        Storage.get(fileName, { download: true })
            .then(fileContent => {
                return fileContent.Body?.text();
            })
            .then(textContent => {
                console.log('Text Content:', textContent);
                setScriptContent(textContent || '');
            })
            .catch(error => {
                console.error('Error downloading file:', error);
        });      
    }
      
    useEffect(() => {
        const url = window.location.search;
        const searchParams = new URLSearchParams(url);
        setTitle(searchParams.get('title') || undefined);
        setScriptid(searchParams.get('scriptid') || undefined);
    }, []);

    useEffect(() => {
        if(title && scriptid)
            populateScriptContent();
    }, [title, scriptid]);

    const saveVersion = () => {
        const uniqueString = uuidv4();
        setIsSavingVersion(true);
        setVersionErrorOpen(false);
        setVersionSuccessOpen(false);

        createScriptVersion({
            variables: {
                scriptid: scriptid || '',
                title: uniqueString,
            }
        }).then(() => {
            const userid = localStorage.getItem('userid');
            const fileName = "userid-"+userid+ "/scriptid-" + scriptid + "/versions/"+uniqueString+".txt";
            Storage.put(fileName, scriptContent || '', {
                contentType: 'text/plain'
            }).then(() => {
                setIsSavingVersion(false);
                setVersionSuccessOpen(true);
            }).catch(() => {
                setIsSavingVersion(false);
                setVersionErrorOpen(true);
            });
        }).catch(() => {
            setIsSavingVersion(false);
            setVersionErrorOpen(true);
        })
    }

    const closeAllNotifications = () => {
        setVersionErrorOpen(false);
        setVersionSuccessOpen(false);
    }

    if(scriptid && title) {
        return (
            <>
                <div>
                    <Snackbar open={versionErrorOpen} autoHideDuration={6000} onClose={closeAllNotifications}>
                        <Alert onClose={closeAllNotifications} severity="error" sx={{ width: '100%' }}>
                            Error saving version, please try again.
                        </Alert>
                    </Snackbar>
                    <Snackbar open={versionSuccessOpen} autoHideDuration={6000} onClose={closeAllNotifications}>
                        <Alert onClose={closeAllNotifications} severity="success" sx={{ width: '100%' }}>
                            Version saved successfully.
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
                                                width: window.innerWidth * 0.6,
                                            }}
                                            value={scriptContent}
                                            onChange={(e) => setScriptContent(e.target.value)}
                                            />
                                        </Grid>
                                    </Grow>
                                    <Button onClick={saveVersion} disabled={isSavingVersion}>
                                        Save Version
                                    </Button>
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