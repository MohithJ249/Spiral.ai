import { Grid, Grow, Paper, TextField, Typography, Snackbar, Alert, Fab, Tooltip, Box, Stack, Card, CardContent, Switch, FormGroup, FormControlLabel, MenuItem, IconButton, Slide } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import axios from 'axios';
import { useDeleteScriptMutation, useGetScriptVersionsQuery, useGetScriptRecordingsQuery, useGetAllScriptCommentsLazyQuery, useDeleteCommentMutation } from '../../generated/graphql';
import AudioRecorder from '../../components/AudioRecorder';
import CollaboratorModal from '../../components/CollaboratorModal';
import DeleteModal from '../../components/DeleteModal';
import MakeVersionButton from '../../components/MakeVersionButton';
import { Add, Build, Close, Create, Done, History, QueueMusic, Remove, Save } from '@mui/icons-material';
import OpenAI from "openai";
import { commentsStyling, cardContentStyling, deleteButtonCommentsStyling, textContentCommentsStyling, timeSavedCommentsStyling, usernameCommentsStyling, textContentStylingItalic } from '../../styles/styles';
import CircularProgressValue from '../../components/CircularProgressValue';

export default function EditingPage() {
    const url = window.location.search;
    const searchParams = useMemo(() => new URLSearchParams(url), [url]);
    const title = useMemo(() => searchParams.get('title'), [searchParams]);
    const scriptid = useMemo(() => searchParams.get('scriptid'), [searchParams]);

    
    // for plagiarism
    const [plagiarismScore, setPlagiarismScore] = useState<number>();
    const [isCalculatingPlagiarism, setIsCalculatingPlagiarism] = useState<boolean>(false);
    
    
    const [scriptContent, setScriptContent] = useState<string>('');
    const [isSavingScript, setIsSavingScript] = useState<boolean>(false);
    const [generatedText, setGeneratedText] = useState<string | null>('');
    const [promptText, setPromptText] = useState<string>('');
    
    // for notifications
    const [notificationText, setNotificationText] = useState<string>();
    const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
    const [notificationSeverity, setNotificationSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');
    
    // for the right side of the editing page that allows for highlighting text to be replaced by presets
    // or custom prompting
    const [selectedTextPosition, setSelectedTextPosition] = useState<[number, number] | undefined>(undefined);
    const [customPromptingEnabled, setCustomPromptingEnabled] = useState<boolean>(false);
    const [selectorType, setSelectorType] = useState<string>('Tone');
    const [tone, setTone] = useState<string>('Casual');
    const [textLength, setTextLength] = useState<string>('Increase');
    const [complexity, setComplexity] = useState<string>('Increase');
    const [synonym, setSynonym] = useState<string>('Alternative Synonym');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    // for editing textfield text sizing
    const [fontSize, setFontSize] = useState<number>(15);

    
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

    // for ChatGPT access
    const openai = new OpenAI({
        apiKey: process.env.REACT_APP_API_KEY,
        dangerouslyAllowBrowser: true
    });

    // get highlighted text
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
            // store the script in S3
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

        // get the latest version of the script from s3
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
            // need to remove all versions of the script
            scriptVersionsData.getScriptVersions?.forEach(async version => {
                await Storage.remove("userid-"+localStorage.getItem('userid')+"/scriptid-"+scriptid+"/versions/"+version?.versionid+".txt");
            });
        }

        if(scriptRecordingsData) {
            // need to remove all recordings of the script
            scriptRecordingsData.getScriptRecordings?.forEach(async recording => {
                await Storage.remove("userid-"+localStorage.getItem('userid')+"/scriptid-"+scriptid+"/recordings/"+recording?.recordingid+".wav");
            });
        }

        // this script won't be accessible anymore, remove id to not have empty scriptids
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

    // to store the selected text and the starting and ending indices of the selected text
    // to replace later.
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

                setSelectedTextPosition([start, end]);
            }
        }
    }

    // after generating new text and replace is clicked, then adjust the whole script by adding
    // the generated text in the right location properly
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
          }
        }
    }

    // prompting text for ChatGPT based on presets or custom prompting by user
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
    
    // function to call ChatGPT and generate new text
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
        // when x is clicked for each comment on editing page, this is called to
        // delete the comment
        await deleteCommentMutation({
            variables: {
                commentid: commentid
            }
        });
        showNotification('success', 'Comment deleted successfully!');
        refetchComments();
    }

    // to switch between custom prompting and presets to save space on UI
    const handleSwitchChange = (event: any) => {
        setCustomPromptingEnabled(event.target.checked);
    };

    const styledActionsButtons = {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '1%',
        marginBottom: '1%',
        '& > :not(style)': { m: 0.75 }
    }
      
    const headerStyling = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };
    
    // all recordings are stored in /Recordings file to show all the recordings for this script
    const goToRecordings = () => { 
        window.location.href = '/Recordings?title=' + title + '&scriptid=' + scriptid;
    }   

    // call plagiarism API to get score
    const getPlagiarismScore = async () => {
        const apiKey = '7be95795bdeca695de83eb8434ea72b9';
        const apiUrl = 'https://www.prepostseo.com/apis/checkPlag';
    
        const params = new URLSearchParams();
        params.append('key', apiKey);
        params.append('data', scriptContent);
    
        try {
            setIsCalculatingPlagiarism(true);

            // wait for response and set score
            const response = await axios.post(apiUrl, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if(response.data.error) {
                showNotification('error', 'API Error: '+response.data.error);
            }
            // console.log(response.data);
            setPlagiarismScore(response.data.plagPercent);
            // used to make sure user is not able to click when the api is calculating
            // after the score is set, then set to false, to enable button
            setIsCalculatingPlagiarism(false);
        } catch (error) {
            console.error('Error calling plagiarism API:', error);
        }
    };

    const getCustomPrompting = () => {
        return (
            <TextField
                id="prompt-text"
                value={promptText}
                multiline
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Make the tone more casual"
                rows={window.innerHeight * 0.2 / 28}
            />
        );
    };

    // helper functions for increasing and decreasing font size
    const handleIncreaseFontSize = () => {
        setFontSize((prevSize) => Math.min(prevSize + 2, 30));
    };

    const handleDecreaseFontSize = () => {
        setFontSize((prevSize) => Math.max(prevSize - 2, 15)); 
    };

    
    // Give the right options for each preset, each dropdown (textfield selector) is generated for each preset
    // each preset's relative function to set the value of that preset is done within the textfield select
    const getSelector = () => {
        if(selectorType === 'Length') {
            return (
                <TextField
                    value={textLength}
                    id='lengthSelector'
                    label="Customize Length:"
                    select
                    onChange={(e) => setTextLength(e.target.value)}
                    sx={{margin: 2}}
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
                    sx={{margin: 2}}
                    data-testid='toneDropdown'
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
                    sx={{margin: 2}}
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
                    sx={{margin: 2}}
                >
                    <MenuItem key={1} value={"More complex synonym"}>More Complex Synonym</MenuItem>
                    <MenuItem key={2} value={"Alternative Synonym"}>Alternative Synonym</MenuItem>
                    <MenuItem key={3} value={"Less complex synonym"}>Simpler Synonym</MenuItem>
                </TextField>
            );
        }
    }

    // helper function to display the preset selections
    const getSelections = () => {
        return (
            <>
                <TextField
                    value={selectorType}
                    id='selectorType'
                    label="What would you like to modify"
                    select
                    onChange={(e) => setSelectorType(e.target.value)}
                    sx={{margin: 2}}
                    data-testid='modifyDropdown'
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

    // helper function for the custom prompting switch on the UI
    const displayPromptOrSelections = () => {
        return customPromptingEnabled ? getCustomPrompting() : getSelections();
    }

    // helper function to display comments for this script
    const displayComments = () => {
        if(data?.getAllScriptComments?.length) {
            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            console.log(data)
            // make backend call to retrive all comments and map each one to a card display
            return data.getAllScriptComments.map((comment, index) => {
                if (comment?.commentid && comment?.text_content && comment?.username && comment?.time_saved) {
                    return (
                        <Grow in key={index} timeout={2000 + index * 300}>
                            <Card key={comment.commentid} sx={commentsStyling}>
                                <CardContent sx={cardContentStyling}>
                                <Box sx={headerStyling}>
                                    <Typography variant="subtitle1" sx={usernameCommentsStyling}>{comment.username}</Typography>
                                    <IconButton onClick={() => deleteComment(comment.commentid)} sx={deleteButtonCommentsStyling}>
                                    <Close />
                                    </IconButton>
                                </Box>
                                <Typography variant="caption" sx={timeSavedCommentsStyling}>{comment.time_saved}</Typography>
                                <Typography variant="body2" sx={textContentStylingItalic}>{comment.text_ref}</Typography>
                                <Typography variant="body2" sx={textContentCommentsStyling}>{comment.text_content}</Typography>
                                </CardContent>
                            </Card>
                        </Grow>
                    );
                }
                return null;
            })
        }
        else {
            // If no comments exist yet
            return (
                <>
                    <Card sx={commentsStyling}>
                        <CardContent sx={cardContentStyling}>
                        <Box sx={headerStyling}>
                        </Box>
                        <Typography variant="body2" sx={textContentCommentsStyling}>{"You have no comments at this time."}</Typography>
                        </CardContent>
                    </Card>
                </>
            )
        }
    }
    
    if(scriptid && title && scriptContent !== undefined) {

        return (
            <>
                <div>
                    <Snackbar
                        open={isNotificationOpen}
                        autoHideDuration={6000}
                        onClose={() => setIsNotificationOpen(false)}
                        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                        sx={{marginTop: '5%'}}
                        TransitionComponent={Slide}
                        >
                        <Alert
                            onClose={() => setIsNotificationOpen(false)}
                            severity={notificationSeverity}
                            sx={{ 
                                width: '100%',
                                ".MuiButtonBase-root": {
                                    marginTop: '-10%',
                                }
                            }}
                        >
                            {notificationText}
                        </Alert>
                    </Snackbar>
                    <Typography variant="h4" sx={{marginTop: '1%', marginBottom: '1%', backgroundColor: '#f1efee', fontFamily: 'MuseoSlab'}}>{title}</Typography>

                    <div style={{ flexGrow: 1, backgroundColor: '#f1efee' }}>
                        <Grid sx={{ flexGrow: 1, minHeight: '100vh'}} container justifyContent="center" spacing={2}>
                            {/* Left side of the page with quality of life features */}
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
                                                <AudioRecorder scriptid={scriptid} scriptTitle={title} onShowNotification={showNotification} mode="Editing"/>
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

                                                <Tooltip title='View All Recordings'>
                                                    <Fab size='small' onClick={goToRecordings} >
                                                        <QueueMusic />
                                                    </Fab>
                                                </Tooltip>

                                                <CollaboratorModal scriptid={scriptid} onShowNotification={showNotification}/>
                                                <DeleteModal onDelete={deleteScript} deleteText='Are you sure you want to delete this script?'/>
                                            </Box>
                                        </Grow>

                                        <Grow in timeout={1750}>
                                            <Stack direction='row' spacing={2} sx={{marginBottom: '2%', justifyContent: 'center', alignItems: 'center'}}>
                                                <Fab size='small' onClick={handleDecreaseFontSize}>
                                                    <Remove /> 
                                                </Fab>
                                                <Typography variant='h6' sx={{marginTop: '1%', marginBottom: '1%', backgroundColor: '#f1efee', fontFamily: 'MuseoSlab'}}>Font Size</Typography>
                                                <Fab size='small' onClick={handleIncreaseFontSize}>
                                                    <Add /> 
                                                </Fab>
                                            </Stack>
                                        </Grow>
                                        <Grow in timeout={1825}>
                                            <Stack spacing={2} direction='row' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Fab onClick={getPlagiarismScore} variant='extended' disabled={isCalculatingPlagiarism} sx={{marginBottom: '3%'}}>
                                                    {isCalculatingPlagiarism ? 'Calculating Plagiarism...' : 'Calculate Plagiarism'}
                                                </Fab>     
                                                <CircularProgressValue value={plagiarismScore || 0} />
                                            </Stack>
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
                                                marginTop: '5%',
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
                                            {displayComments()}
                                            </Paper>
                                        </Grow>     
                                    </Paper>
                                </Grid>
                            </Grow>
                            
                            {/* Main editing section */}
                            <Grow in key="EditingPane" timeout={1500}>
                                {/** make sure this textfield is not changing size vertically */}
                                <Grid item>
                                    <TextField
                                        id="outlined-multiline-static"
                                        multiline
                                        rows={window.innerHeight / 24}
                                        variant="outlined"
                                        sx={{
                                            width: `${window.innerWidth * 0.5}px`,
                                            minHeight: `${window.innerHeight / 24 * 23}px`,
                                            maxHeight: `${window.innerHeight / 24 * 23}px`,
                                            overflow: 'auto',
                                            display: 'flex',
                                            '&::-webkit-scrollbar': {
                                                width: '0.2rem', 
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                background: '#aaa', // Color of the scrollbar thumb
                                                borderRadius: '2px', // Adjust as needed
                                            },
                                            '&::-webkit-scrollbar-thumb:hover': {
                                                background: '#aaa', // Color on hover, adjust as needed
                                            },
                                        }}
                                        value={scriptContent}
                                        onChange={(e) => setScriptContent(e.target.value)}
                                        InputProps={{
                                            style: {
                                                fontSize: fontSize,
                                                lineHeight: 1.4,
                                                flex: 1
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grow>

                            {/* Custom presets and prompting text generating pane on right side */}
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
                                                <Fab  onClick={selectText} variant='extended' disabled={isGenerating}
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
                                                    data-testid='selectedTextField'
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
                                                    inputProps={{ "data-testid": "generatedTextField" }}
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