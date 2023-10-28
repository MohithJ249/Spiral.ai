import { Button, Grid, Grow, Paper, TextField, Typography, Snackbar, Alert, Fab, Tooltip, Box} from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import axios from 'axios';
import { useDeleteScriptMutation, useGetScriptVersionsQuery, useGetScriptRecordingsQuery, } from '../../generated/graphql';
import AudioRecorder from '../../components/AudioRecorder';
import CollaboratorModal from '../../components/CollaboratorModal';
import MakeVersionButton from '../../components/MakeVersionButton';
import { Delete, History, PostAdd, Save } from '@mui/icons-material';

export default function EditingPage() {
    const url = window.location.search;
    const searchParams = useMemo(() => new URLSearchParams(url), [url]);
    const title = useMemo(() => searchParams.get('title'), [searchParams]);
    const scriptid = useMemo(() => searchParams.get('scriptid'), [searchParams]);

    const [scriptContent, setScriptContent] = useState<string>();
    const [isSavingScript, setIsSavingScript] = useState<boolean>(false);
    const [generatedText, setGeneratedText] = useState<string>('');
    const [promptText, setPromptText] = useState<string>('');
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

    const disabledBoxStyle = {
        color: 'initial',
        pointerEvents: 'none' as React.CSSProperties["pointerEvents"]
    };

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
                const indices = indicesOfNonSpacesAroundPosition(scriptContent, selectionStart, selectionEnd)
                setSelectedTextPosition([indices[0], indices[1]]);
            }
        }
    }

    const indicesOfNonSpacesAroundPosition = (str: string, start: number, end: number) => {
        var startIndex = -1;
        var endIndex = -1;
        for (let i = start - 1; i >= 0; i--) {
            if (str[i] !== ' ') {
                startIndex = i+1;
                break;
            }
        }

        for (let i = end; i < str.length; i++) {
            if (str[i] !== ' ') {
                endIndex = i;
                break;
            }
        }
        
        return [startIndex, endIndex]; // Character not found before the selected position
    }

    const handleReplaceText = async () => {      
        if (selectedTextPosition) {
          const selectionStart = selectedTextPosition[0];
          const selectionEnd = selectedTextPosition[1];
      
          if(scriptContent) {
              
            // TODO: need to fix spacing around highlighted text
            var responseText = ' ' + generatedText;
            if(scriptContent.charAt(selectionEnd) === ' ')
                responseText += ' ';

            const newText = scriptContent.slice(0, selectionStart) + responseText + scriptContent.slice(selectionEnd);
            setScriptContent(newText);
            setSelectedTextPosition(undefined);
            showNotification('success', 'Text replaced successfully!')
          }
        }
    }
    
    const generateText = async () => {
        //llama 2 response
        if(selectedTextPosition) {
            const selectedText = scriptContent?.slice(selectedTextPosition[0], selectedTextPosition[1]).trim();
    
            const queryParam = encodeURIComponent(promptText+": "+selectedText);
            console.log(queryParam)
            const apiUrl = `https://2da9ogp80m.execute-api.us-east-2.amazonaws.com/dev/replicatelambda?prompt_input=${queryParam}`;
            
            const LLMResponse = await axios.get(apiUrl, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            setGeneratedText(LLMResponse.data.output);
        }
    }

    const styledCard2LeftPane = {
        backgroundColor: '#4d4d4d',
        display: 'flex',
        justifyContent: 'center',
        margin: '10px 0px 0px 0px',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        '& > :not(style)': { m: 1 }
    }
    
    if(scriptid && title !== undefined && scriptContent !== undefined) {
        return (
            <>
                <div>
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

                    <Typography variant="h3">{title}</Typography>

                    <div style={{ flexGrow: 1 }}>
                        <Grid sx={{ flexGrow: 1 }} container justifyContent="center" spacing={1}>
                            <Grow in key='RecordingPane' timeout={1000}>
                                <Grid item>
                                    <Paper
                                        sx={{
                                        height: window.innerHeight * 0.8,
                                        width: window.innerWidth * 0.2,
                                        backgroundColor: '#eeeeee',

                                        }}>
                                                
                                        <AudioRecorder scriptid={scriptid} onShowNotification={showNotification}/>
                                        
                                        {/* script management card */}
                                        <Box sx={styledCard2LeftPane} flexDirection={'row'}>
                                            <Tooltip title="Save Script">
                                                <Fab onClick={saveScript} disabled={isSavingScript}>
                                                    <Save />
                                                </Fab>
                                            </Tooltip>
                                            
                                            <Tooltip title='Generate New Version'>
                                                <MakeVersionButton scriptid={scriptid} scriptContent={scriptContent} onShowNotification={showNotification} />
                                            </Tooltip>

                                            <Tooltip title='View Version History'>
                                                <Fab onClick={() => window.location.href = '/VersionHistory?scriptid='+scriptid+'&title='+title}>
                                                    <History />
                                                </Fab>
                                            </Tooltip>

                                            <CollaboratorModal scriptid={scriptid} onShowNotification={showNotification}/>
                                            
                                            <Tooltip title='Delete Script'>
                                                <Fab color='error' onClick={deleteScript}>
                                                    <Delete />
                                                </Fab>
                                            </Tooltip>
                                        </Box>

                                        {/* Add Documents card */}
                                        <Box sx={styledCard2LeftPane}>
                                            <Typography variant="h5">
                                                Add Document Parsing so button + additional information
                                            </Typography>
                                        </Box>
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

                            <Grow in key='LLMPane' timeout={2000}>
                                <Grid item>
                                    <Paper
                                        sx={{
                                        height: window.innerHeight * 0.8,
                                        width: window.innerWidth * 0.2,
                                        backgroundColor: '#eeeeee',
                                        }}
                                    >

                                        <Button onClick={selectText}>
                                            Select Text
                                        </Button>
                                        <TextField
                                            id='selected-text'
                                            value={selectedTextPosition ? scriptContent?.slice(selectedTextPosition[0], selectedTextPosition[1]).trim() : ''}
                                            multiline
                                            placeholder='Selected text will appear here.'
                                            style={disabledBoxStyle}
                                        />

                                        <Button onClick={generateText} disabled = {selectedTextPosition===undefined || promptText===undefined}>
                                            Generate
                                        </Button>
                                        <TextField
                                            id='prompt-text'
                                            value={promptText}
                                            multiline
                                            onChange={(e) => setPromptText(e.target.value)}
                                            placeholder='Prompt here.'
                                        />
                                        
                                        <Button onClick={handleReplaceText} disabled={!generatedText}>
                                            Replace
                                        </Button>
                                        <TextField
                                            id='generated-text'
                                            value={generatedText}
                                            multiline
                                            onChange={(e) => setGeneratedText(e.target.value)}
                                            placeholder='Generated text will appear here.'
                                        />
                                    </Paper>
                                </Grid>
                            </Grow>
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