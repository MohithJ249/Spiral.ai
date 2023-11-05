import { Button, Grid, Grow, Paper, TextField, Typography, Snackbar, Alert, Fab, Tooltip, Box, Stack, Card, CardContent, Switch, FormGroup, FormControlLabel, MenuItem} from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import axios from 'axios';
import { useDeleteScriptMutation, useGetScriptVersionsQuery, useGetScriptRecordingsQuery, useGetAllScriptCommentsLazyQuery, useDeleteCommentMutation } from '../../generated/graphql';
import AudioRecorder from '../../components/AudioRecorder';
import CollaboratorModal from '../../components/CollaboratorModal';
import MakeVersionButton from '../../components/MakeVersionButton';
import { Build, Create, Delete, Done, History, PostAdd, Save } from '@mui/icons-material';
import OpenAI from "openai";

export default function EditingPage() {
    const url = window.location.search;
    const searchParams = useMemo(() => new URLSearchParams(url), [url]);
    const title = useMemo(() => searchParams.get('title'), [searchParams]);
    const scriptid = useMemo(() => searchParams.get('scriptid'), [searchParams]);

    const [scriptContent, setScriptContent] = useState<string>();
    const [isSavingScript, setIsSavingScript] = useState<boolean>(false);
    const [generatedText, setGeneratedText] = useState<string | null>('');
    const [promptText, setPromptText] = useState<string>('');
    const [notificationText, setNotificationText] = useState<string>();
    const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
    const [notificationSeverity, setNotificationSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');
    const [selectedTextPosition, setSelectedTextPosition] = useState<[number, number] | undefined>(undefined);
    const [customPromptingEnabled, setCustomPromptingEnabled] = useState<boolean>(false);
    const [tone, setTone] = useState<string>('Casual');
    const [textLength, setTextLength] = useState<string>('Increase');
    const [selectorType, setSelectorType] = useState<string>('Tone');

    const [fetchScriptComments, { data, refetch: refetchComments }] = useGetAllScriptCommentsLazyQuery();
    const [deleteCommentMutation] = useDeleteCommentMutation();
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

    const openai = new OpenAI({
        apiKey: process.env.REACT_APP_API_KEY,
        dangerouslyAllowBrowser: true
    });

    useEffect(() => {
        populateScriptContent();
        fetchScriptComments({
            variables: {
                scriptid: scriptid || ''
            }
        });
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

    const getPromptText = (selectedText: string) : string => {
        if(customPromptingEnabled) {
            return promptText+". "+selectedText;
        }
        else {
            if(selectorType === 'Length') {
                if(textLength === 'Increase') {
                    return 'Increase text length by adding more detail: '+selectedText;
                }
                else {
                    return 'Shorten this text: '+selectedText;
                }
            }
            else if(selectorType === 'Tone') {
                return 'Change the tone of this text to '+tone+': '+selectedText;
            }
        }

        return '';
    }
    
    const generateText = async () => {
        if(selectedTextPosition) {
            const selectedText = scriptContent?.slice(selectedTextPosition[0], selectedTextPosition[1]).trim();
            
            if(selectedText) {
                const queryParam = getPromptText(selectedText);
                console.log(queryParam)
                
                try {
                    const LLMResponse = await openai.chat.completions.create({
                        model: "gpt-3.5-turbo",
                        messages: [{ role: "user", content: queryParam }],
                    })
                    setGeneratedText(LLMResponse.choices[0].message.content);
                }
                catch (error) {
                    console.error(`ERROR: ${error}`)
                }
            }
        }
    }

    const deleteComment = async (commentid: string) => {
        await deleteCommentMutation({
            variables: {
                commentid: commentid
            }
        });
        refetchComments();
    }

    const handleSwitchChange = (event: any) => {
        setCustomPromptingEnabled(event.target.checked);
    };

    const styledActionsButtons = {
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        marginTop: '-7%',
        marginBottom: '1%',
        '& > :not(style)': { m: 1 }
    }
    const styledCard2LeftPane = {
        borderStyle: 'solid',
        borderWidth: '2px',
        borderColor: '#d4d2d1',
        backgroundColor: 'white',
        color: 'black',
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        borderRadius: '15px',
        '& > :not(style)': { m: 1 }
    }

    const TextfieldStyling = {
        backgroundColor: 'white',
        borderRadius: '15px',
        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderRadius: '15px',
        },
    };

    const FabStyling = {
        color: 'white',
        backgroundColor: 'black',
        '&:hover': { 
            color: 'white',
            backgroundColor: '#4d4d4d' 
        }
    }

    const goToRecordings = () => { 
        window.location.href = '/Recordings?title=' + title + '&scriptid=' + scriptid;
    }   

    const getCustomPrompting = () => {
        return (
            <TextField
                id="prompt-text"
                value={promptText}
                multiline
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Prompt here."
                rows={window.innerHeight * 0.2 / 28}
                sx={{
                ...TextfieldStyling
                }}
            />
        );
    }

    const getSelector = () => {
        if(selectorType === 'Length') {
            return (
                <TextField
                    value={textLength}
                    id='lengthSelector'
                    label="Customize Length:"
                    select
                    onChange={(e) => setTextLength(e.target.value)}
                    sx={{margin: 2, ...TextfieldStyling}}
                >
                    <MenuItem key={1} value={"Increase"}>Increase</MenuItem>
                    <MenuItem key={2} value={"Decrease"}>Decrease</MenuItem>
                </TextField>
            );
        }
        else if(selectorType === 'Tone') {
            return (
                <TextField
                    value={tone}
                    id='toneSelector'
                    label="Convert tone to:"
                    select
                    onChange={(e) => setTone(e.target.value)}
                    sx={{margin: 2, ...TextfieldStyling}}
                >
                    <MenuItem key={1} value={"Casual"}>Casual</MenuItem>
                    <MenuItem key={2} value={"Persuasive"}>Persuasive</MenuItem>
                    <MenuItem key={3} value={"Professional"}>Professional</MenuItem>
                    <MenuItem key={4} value={"Academic"}>Academic</MenuItem>
                    <MenuItem key={5} value={"Dramatic"}>Dramatic</MenuItem>
                    <MenuItem key={6} value={"Humorous"}>Humorous</MenuItem>
                </TextField>
            );
        }
    }

    const getSelections = () => {
        return (
            <>
                <TextField
                    value={selectorType}
                    id='selectorType'
                    label="What would you like to modify"
                    select
                    onChange={(e) => setSelectorType(e.target.value)}
                    sx={{margin: 2, ...TextfieldStyling}}
                >
                    <MenuItem key={1} value={"Length"}>Length</MenuItem>
                    <MenuItem key={2} value={"Tone"}>Tone</MenuItem>
                </TextField>
                {getSelector()}
            </>
        );
    }

    const displayPromptOrSelections = () => {
        return customPromptingEnabled ? getCustomPrompting() : getSelections();
    }
    
    if(scriptid && title && scriptContent !== undefined) {
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
                    {/* <br></br> */}
                    {/* <Typography variant="h4" sx={{backgroundColor: '#f1efee'}}></Typography> */}
                    <Typography variant="h4" sx={{marginTop: '1%', marginBottom: '1%', backgroundColor: '#f1efee', fontFamily: 'MuseoSlab'}}>{title}</Typography>

                    <div style={{ flexGrow: 1, backgroundColor: '#f1efee' }}>
                        <Grid sx={{ flexGrow: 1, width: "100vw", height: '100vh'}} container justifyContent="center" spacing={1}>
                            <Grow in key='RecordingPane' timeout={1000}>
                                <Grid item>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                        height: window.innerHeight * 0.8,
                                        width: window.innerWidth * 0.2,
                                        backgroundColor: '#f1efee',
                                        }}>
                                        <Grow in timeout={1250}>
                                            <div style={{marginBottom: '5%'}}>
                                                <AudioRecorder scriptid={scriptid} scriptTitle={title} onShowNotification={showNotification}/>
                                            </div>
                                        </Grow>  
                                        <Grow in timeout={1500}>
                                            <Box sx={styledActionsButtons} flexDirection={'row'}>
                                                <Tooltip title="Save Script">
                                                    <Fab size='small' onClick={saveScript} disabled={isSavingScript}sx={FabStyling}>
                                                        <Save />
                                                    </Fab>
                                                </Tooltip>
                                                
                                                <Tooltip title='Generate New Version'>
                                                    <MakeVersionButton scriptid={scriptid} scriptContent={scriptContent} onShowNotification={showNotification} />
                                                </Tooltip>

                                                <Tooltip title='View Version History'>
                                                    <Fab sx={FabStyling} size='small' onClick={() => window.location.href = '/VersionHistory?scriptid='+scriptid+'&title='+title} >
                                                        <History />
                                                    </Fab>
                                                </Tooltip>

                                                <CollaboratorModal scriptid={scriptid} onShowNotification={showNotification}/>
                                                
                                                <Tooltip title='Delete Script'>
                                                    <Fab size='small' color='error' onClick={deleteScript}>
                                                        <Delete />
                                                    </Fab>
                                                </Tooltip>
                                            </Box>
                                        </Grow>
                                        <Grow in timeout={1750}>
                                            <Fab onClick={goToRecordings} variant='extended' sx={{...FabStyling}}>
                                                View All Recordings
                                            </Fab>    
                                        </Grow>   
                                        
                                        {/* script management card */}


                                        <Grow in timeout={2000}>
                                            <div style={{ overflowY: 'auto', maxHeight: '400px', marginTop: '23%'}}>
                                                <Box sx={styledCard2LeftPane} flexDirection={'column'}>
                                                    <Typography variant="h5">Comments</Typography>
                                                    {data?.getAllScriptComments?.map(comment => {
                                                        if (comment?.commentid && comment?.text_content && comment?.username && comment?.time_saved) {
                                                            return (
                                                                <Card key={comment.commentid}>
                                                                    <CardContent>
                                                                        <Typography variant="h6">Posted by {comment.username} at {comment.time_saved}</Typography>
                                                                        <Typography variant="body1">{comment.text_content}</Typography>
                                                                        <Button onClick={() => deleteComment(comment.commentid)}>X</Button>
                                                                    </CardContent>
                                                                </Card>
                                                            );
                                                        }
                                                        return null; // Or any other fallback you want when text_content is undefined or falsy
                                                    })}
                                                </Box>
                                            </div>
                                        </Grow>     
                                    </Paper>
                                </Grid>
                            </Grow>

                            <Grow in key='EditingPane' timeout={1500}>
                                <Grid item>
                                    <TextField
                                    id="outlined-multiline-static"
                                    multiline
                                    rows={Math.ceil(window.innerHeight * 0.8 / 24)}
                                    variant="outlined"
                                    sx={{
                                        width: `${window.innerWidth * 0.5}px`,
                                        ...TextfieldStyling
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
                                            height: `${window.innerHeight * 0.8}px`,
                                            width: `${window.innerWidth * 0.2}px`,
                                            backgroundColor: '#f1efee', 
                                            boxSizing: 'border-box', 
                                        }}
                                        elevation={0}
                                       
                                    >

                                        <Stack spacing={2} direction="column">
                                            <Grow in timeout={2200} >
                                                <Fab  onClick={selectText} variant='extended' 
                                                            sx={FabStyling}>
                                                    <Done />
                                                    Highlight & Select Text
                                                </Fab>
    
                                            </Grow>

                                            <Grow in timeout={2400}>
                                                <TextField
                                                    id='selected-text'
                                                    value={selectedTextPosition ? scriptContent?.slice(selectedTextPosition[0], selectedTextPosition[1]).trim() : ''}
                                                    multiline
                                                    placeholder='Selected text will appear here.'
                                                    style={disabledBoxStyle}
                                                    rows={window.innerHeight * 0.2 / 28}
                                                    sx={{
                                                        ...TextfieldStyling
                                                    }}
                                                    />
                                            </Grow>

                                            <FormGroup>
                                                <FormControlLabel control={
                                                    <Switch 
                                                            checked={customPromptingEnabled}
                                                            onChange={handleSwitchChange} 
                                                    />} 
                                                    label="Custom Prompting" />
                                            </FormGroup>

                                            {displayPromptOrSelections()}

                                            <Grow in timeout={2800}>
                                                <Stack direction='row' sx={{justifyContent: 'center', '& > :not(style)': { margin: 0.5 }}}>
                                                    <Fab variant='extended' onClick={generateText} disabled = {selectedTextPosition===undefined || promptText===undefined} sx={FabStyling}>
                                                        <Build />
                                                        Generate
                                                    </Fab>
                                                    
                                                    <Fab variant='extended' onClick={handleReplaceText} disabled={!generatedText} sx={FabStyling}>
                                                        <Create />
                                                        Replace
                                                    </Fab>
                                                </Stack>
                                            </Grow>

                                            <Grow in timeout={3000}>
                                                <TextField
                                                    id='generated-text'
                                                    value={generatedText}
                                                    multiline
                                                    onChange={(e) => setGeneratedText(e.target.value)}
                                                    placeholder='Generated text will appear here.'
                                                    rows={window.innerHeight * 0.2 / 28}
                                                    sx={{                                                        
                                                        ...TextfieldStyling
                                                    }}
                                                />
                                            </Grow>
                                        </Stack>
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