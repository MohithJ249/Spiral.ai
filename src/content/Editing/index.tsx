import { Button, Grid, Grow, Paper, TextField, Typography, Snackbar, Alert, Fab, Tooltip, Box, Stack, Card, CardContent, Switch, FormGroup, FormControlLabel, MenuItem, Menu, IconButton} from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import axios from 'axios';
import { useDeleteScriptMutation, useGetScriptVersionsQuery, useGetScriptRecordingsQuery, useGetAllScriptCommentsLazyQuery, useDeleteCommentMutation } from '../../generated/graphql';
import AudioRecorder from '../../components/AudioRecorder';
import CollaboratorModal from '../../components/CollaboratorModal';
import DeleteModal from '../../components/DeleteModal';
import MakeVersionButton from '../../components/MakeVersionButton';
import { Build, Close, Create, Delete, Done, History, PostAdd, Save } from '@mui/icons-material';
import OpenAI from "openai";
import { set } from 'nprogress';

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
    const [selectorType, setSelectorType] = useState<string>('Tone');
    const [tone, setTone] = useState<string>('Casual');
    const [textLength, setTextLength] = useState<string>('Increase');
    const [complexity, setComplexity] = useState<string>('Increase');
    const [synonym, setSynonym] = useState<string>('Alternative Synonym');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [mode, setMode] = useState<string>('Editing');

    const [beforeText, setBeforeText] = useState<string>('');
    const [afterText, setAfterText] = useState<string>('');

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

    const selectedText = useMemo(() => {
        if (selectedTextPosition) {
          const selectionStart = selectedTextPosition[0];
          const selectionEnd = selectedTextPosition[1] + 1;
      
          if(scriptContent) {
            return scriptContent.slice(selectionStart, selectionEnd);
          }
        }
        return '';
    }, [scriptContent, selectedTextPosition]);

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

      
            if(scriptContent !== undefined && selectionStart !== null && selectionEnd !== null)
            {
                var start = selectionStart;
                var end = selectionEnd - 1;

                console.log(scriptContent.charAt(start)+" "+scriptContent.charAt(end));

                while(scriptContent.charAt(start) === ' ') {
                    start++;
                }

                while(scriptContent.charAt(end) === ' ') {
                    end--;
                }

                setBeforeText(scriptContent.slice(0, start));
                setSelectedTextPosition([start, end]);
                setAfterText(scriptContent.slice(end+1));
                setMode('Selection')
            }
        }
    }

    const unselectText = () => {
        setSelectedTextPosition(undefined);
        setGeneratedText('');
        setScriptContent(beforeText+selectedText+afterText);
        setMode('Editing');
    }

    const handleReplaceText = async () => {      
        if (selectedTextPosition) {
          const selectionStart = selectedTextPosition[0];
          const selectionEnd = selectedTextPosition[1];
      
          if(scriptContent) {
            const newText = scriptContent.slice(0, selectionStart) + generatedText + scriptContent.slice(selectionEnd+1);
            setScriptContent(newText);
            setSelectedTextPosition(undefined);
            setGeneratedText('');
            showNotification('success', 'Text replaced successfully!')
            setMode('Editing')
            setBeforeText('');
            setAfterText('');
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
            else if(selectorType === 'Complexity') {
                return complexity + " the complexity of this text: "+selectedText;
            }
            else if(selectorType === 'Synonym') {
                return 'Generate a single '+synonym+' for this word: '+selectedText;
            }
        }

        return '';
    }
    
    const generateText = async () => {
        if(selectedTextPosition) {            
            if(selectedText) {
                const queryParam = getPromptText(selectedText);
                console.log(queryParam)
                setGeneratedText('');
                
                try {
                    setIsGenerating(true);
                    const LLMResponse = await openai.chat.completions.create({
                        model: "gpt-3.5-turbo",
                        messages: [{ role: "user", content: queryParam }],
                    })
                    setGeneratedText(LLMResponse.choices[0].message.content);
                    setIsGenerating(false);
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
        showNotification('success', 'Comment deleted successfully!');
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

    const commentsStyling = {
        backgroundColor: '#edf2fa',
        color: 'black',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '-5%',
        marginRight: '5%', 
        marginTop: '5%', 
        marginBottom: '5%',
        borderRadius: '15px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        '&:hover':{
            backgroundColor: '#e7edf8'
        }
      };
      
      const cardContentStyling = {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      };
      
      const headerStyling = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      };
      
      const usernameStyling = {
        fontWeight: 'bold',
        color: 'black', // or any other color you prefer
      };
      
      const deleteButtonStyling = {
        position: 'absolute',
        top: '8px',
        right: '8px',
        color: 'black', // Adjust if needed
      };
      
      const timeSavedStyling = {
        fontSize: '0.75rem',
        color: 'black', // Adjust if needed
        marginBottom: '8px', // Spacing between time and content
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      };
      
      const textContentStyling = {
        color: 'black', // Adjust if needed
        wordBreak: 'break-word', // To prevent overflow
      };
      

    const TextfieldStyling = {
        backgroundColor: 'white',
        borderRadius: '15px',
        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderRadius: '15px',
        },
    };

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
                placeholder="Make the tone more casual"
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
        else if(selectorType === 'Complexity') {
            return (
                <TextField
                    value={complexity}
                    id='complexitySelector'
                    label="Customize complexity:"
                    select
                    onChange={(e) => setComplexity(e.target.value)}
                    sx={{margin: 2, ...TextfieldStyling}}
                >
                    <MenuItem key={1} value={"Slightly Increase"}>Slightly Increase</MenuItem>
                    <MenuItem key={2} value={"Increase"}>Increase</MenuItem>
                    <MenuItem key={3} value={"Decrease"}>Decrease</MenuItem>
                    <MenuItem key={4} value={"Slightly Decrease"}>Slightly Decrease</MenuItem>
                </TextField>
            );
        }
        else if(selectorType === 'Synonym') {
            return (
                <TextField
                    value={synonym}
                    id='synonymSelector'
                    label="Generate a:"
                    select
                    onChange={(e) => setSynonym(e.target.value)}
                    sx={{margin: 2, ...TextfieldStyling}}
                >
                    <MenuItem key={1} value={"More complex synonym"}>More Complex Synonym</MenuItem>
                    <MenuItem key={2} value={"Alternative Synonym"}>Alternative Synonym</MenuItem>
                    <MenuItem key={3} value={"Less complex synonym"}>Simpler Synonym</MenuItem>
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
                    <MenuItem key={3} value={"Complexity"}>Complexity</MenuItem>
                    <MenuItem key={4} value={"Synonym"}>Synonym</MenuItem>
                </TextField>
                {getSelector()}
            </>
        );
    }

    const displayPromptOrSelections = () => {
        return customPromptingEnabled ? getCustomPrompting() : getSelections();
    }

    const displayEditingPane = () => {
        if(mode === 'Editing') {
            console.log("Editing pane")
            return (
                // display script content with black text
                <Grid item>
                    <TextField
                    id="outlined-multiline-static"
                    multiline
                    rows={Math.ceil(window.innerHeight * 0.9 / 24)}
                    variant="outlined"
                    sx={{
                        width: `${window.innerWidth * 0.5}px`,
                        ...TextfieldStyling
                    }}
                    value={scriptContent}
                    onChange={(e) => setScriptContent(e.target.value)}
                    />
            </Grid>
            )
        }
        else if(mode === 'Selection') {
            // display before text, selected text, and after text. Before and after should be black. Selected should be blue
            console.log("Selection pane")
            return (
                <Grid item>
                    <TextField
                    id="outlined-multiline-static2"
                    multiline
                    rows={Math.ceil(window.innerHeight * 0.9 / 24)}
                    variant="outlined"
                    sx={{
                        width: `${window.innerWidth * 0.5}px`,
                        ...TextfieldStyling
                    }}
                    value={selectedText}
                    >
                        {/* set value to beforeText+selectedText+afterText and ask chatgpt how to make all these texts different colors */}
                    </TextField>
                </Grid>
            )
        }
        return <></>
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
                        <Grid sx={{ flexGrow: 1, width: "100vw", height: '100vh'}} container justifyContent="center" spacing={2}>
                            <Grow in key='RecordingPane' timeout={1000}>
                                <Grid item>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                        height: window.innerHeight * 0.9,
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
                                                    <Fab size='small' onClick={saveScript} disabled={isSavingScript}>
                                                        <Save />
                                                    </Fab>
                                                </Tooltip>
                                                
                                                <Tooltip title='Generate New Version'>
                                                    <MakeVersionButton scriptid={scriptid} scriptContent={scriptContent} onShowNotification={showNotification} />
                                                </Tooltip>

                                                <Tooltip title='View Version History'>
                                                    <Fab size='small' onClick={() => window.location.href = '/VersionHistory?scriptid='+scriptid+'&title='+title} >
                                                        <History />
                                                    </Fab>
                                                </Tooltip>

                                                <CollaboratorModal scriptid={scriptid} onShowNotification={showNotification}/>
                                                <DeleteModal onDeleteScript={deleteScript}/>
                                            </Box>
                                        </Grow>
                                        <Grow in timeout={1750}>
                                            <Fab onClick={goToRecordings} variant='extended'>
                                                View All Recordings
                                            </Fab>    
                                        </Grow>   
                                        
                                        {/* script management card */}


                                        <Grow in timeout={2000}>
                                            <Paper
                                            elevation={0}
                                            sx={{
                                                flexWrap: 'wrap',
                                                borderRadius: '5px',
                                                width: window.innerWidth * 0.2,
                                                height: window.innerHeight * 0.6,
                                                overflow: 'auto',
                                                maxHeight: '40%',
                                                marginTop: '23%',
                                                backgroundColor: '#f1efee',
                                                '&::-webkit-scrollbar': {
                                                width: '0.5rem', 
                                                },
                                                '&::-webkit-scrollbar-thumb': {
                                                background: '#aaa', // Color of the scrollbar thumb
                                                borderRadius: '2px', // Adjust as needed
                                                },
                                                '&::-webkit-scrollbar-thumb:hover': {
                                                background: '#aaa', // Color on hover, adjust as needed
                                                },
                                            }}
                                            component="ul"
                                            >
                                                {data?.getAllScriptComments?.map(comment => {
                                                if (comment?.commentid && comment?.text_content && comment?.username && comment?.time_saved) {
                                                    return (
                                                    <Card key={comment.commentid} sx={commentsStyling}>
                                                        <CardContent sx={cardContentStyling}>
                                                        <Box sx={headerStyling}>
                                                            <Typography variant="subtitle1" sx={usernameStyling}>{comment.username}</Typography>
                                                            <IconButton onClick={() => deleteComment(comment.commentid)} sx={deleteButtonStyling}>
                                                            <Close />
                                                            </IconButton>
                                                        </Box>
                                                        <Typography variant="caption" sx={timeSavedStyling}>{comment.time_saved}</Typography>
                                                        <Typography variant="body2" sx={textContentStyling}>{comment.text_content}</Typography>
                                                        </CardContent>
                                                    </Card>
                                                    );
                                                }
                                                return null;
                                                })}
                                            </Paper>
                                        </Grow>     
                                    </Paper>
                                </Grid>
                            </Grow>

                            <Grow in key='EditingPane' timeout={1500}>
                                {displayEditingPane()}
                            </Grow>

                                <Grow in key='LLMPane' timeout={2000}>
                                    <Grid item>
                                        <Paper
                                        sx={{
                                            height: `${window.innerHeight * 0.9}px`,
                                            width: `${window.innerWidth * 0.2}px`,
                                            backgroundColor: '#f1efee', 
                                            boxSizing: 'border-box', 
                                        }}
                                        elevation={0}
                                    >

                                        <Stack spacing={2} direction="column">
                                            <Grow in timeout={2200} >
                                                <Fab onClick={unselectText} variant='extended' disabled={mode === 'Editing'}
                                                            >
                                                    <Close />
                                                    Unselect Text
                                                </Fab>
                                            </Grow>
                                            <Grow in timeout={2200} >
                                                <Fab  onClick={selectText} variant='extended' 
                                                            >
                                                    <Done />
                                                    Select Text
                                                </Fab>
                                            </Grow>

                                            <Grow in timeout={2400}>
                                                <TextField
                                                    id='selected-text'
                                                    value={selectedText}
                                                    multiline
                                                    placeholder='Selected text will appear here.'
                                                    style={disabledBoxStyle}
                                                    rows={window.innerHeight * 0.2 / 24}
                                                    sx={{
                                                        ...TextfieldStyling
                                                    }}
                                                    />
                                            </Grow>

                                            <FormGroup sx={{'& > :not(style)': { margin: 0.5 }}}>
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
                                                    <Fab variant='extended' disabled = {selectedTextPosition===undefined || promptText===undefined || isGenerating} onClick={generateText}>
                                                        <Build />
                                                        {isGenerating ? 'Generating...' : 'Generate'}
                                                    </Fab>
                                                    
                                                    <Fab variant='extended' onClick={handleReplaceText} disabled={!generatedText} >
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
                                                    rows={window.innerHeight * 0.2 / 24}
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