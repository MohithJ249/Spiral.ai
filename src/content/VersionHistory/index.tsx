import { Grid, Grow,  Typography, Card, CardActionArea, CardContent, TextField, Paper, Fab, Stack } from '@mui/material';
import { useState } from 'react';
import { Storage } from 'aws-amplify';
import { useGetScriptVersionsQuery, useCreateScriptVersionMutation } from '../../generated/graphql';
import { KeyboardReturn, PlaylistAddCheck } from '@mui/icons-material';
import { commentsStyling, cardContentStyling, usernameCommentsStyling } from '../../styles/styles';

interface VersionProps {
    time_saved?: string;
    versionid?: string;
    scriptid?: string;
    onSetScriptContent: (scriptContent: string) => void;
}
  
function Version({time_saved, versionid, scriptid, onSetScriptContent}: VersionProps) {

    const populateScriptContent = () => {
        const userid = localStorage.getItem('userid');
        const fileName = "userid-"+userid+ "/scriptid-" + scriptid + "/versions/"+versionid+".txt";
        
        // get the version of the script selected by user, each version has its own id
        Storage.get(fileName, {
            download: true,
            contentType: 'text/plain'
        }).then((fileContent) => {
            return fileContent.Body?.text();
        }).then((textContent) => {
            onSetScriptContent(textContent || '');
        })
        .catch((err) => {
        });
    }

    return (
        <Card sx={commentsStyling}>
            <CardActionArea onClick={populateScriptContent}>
                <CardContent sx={cardContentStyling}>
                <Typography variant="subtitle1" sx={usernameCommentsStyling}>
                    Time Saved
                </Typography>
                <Typography variant="subtitle1" sx={{justifyContent:'center'}}>
                    {time_saved}
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default function VersionHistory() {
    // to retrieve the right versions for this script
    const url = window.location.search;
    const searchParams = new URLSearchParams(url);
    const title = searchParams.get('title');
    const scriptid = searchParams.get('scriptid');

    // setters for script content and data
    const [scriptContent, setScriptContent] = useState<string>();
    const { data } = useGetScriptVersionsQuery({variables: { scriptid: scriptid || '' }, skip: !scriptid});
    // create new version if user recovers another version
    const [createScriptVersion] = useCreateScriptVersionMutation();

    const textStyle = {
        color: 'initial',
        pointerEvents: 'none' as React.CSSProperties["pointerEvents"]
    };

    const returnToEditing = () => {
        window.location.href = '/Editing?scriptid='+scriptid+'&title='+title;
    }

    const recoverSelectedVersion = () => {
        // Save current script content as a new version, then replace current script content with selected version
        const userid = localStorage.getItem('userid');
        const currentScriptContentFileName = "userid-"+userid+ "/scriptid-" + scriptid + "/"+title+".txt";

        Storage.get(currentScriptContentFileName, { download: true })
        .then(fileContent => {
            return fileContent.Body?.text();
        })
        .then(textContent => {
            createScriptVersion({
                variables: {
                    scriptid: scriptid || '',
                }
            }).then((data) => {
                const newVersionid = data.data?.createScriptVersion?.versionid;
                const newVersionFileName = "userid-"+userid+ "/scriptid-" + scriptid + "/versions/"+newVersionid+".txt";

                Storage.put(newVersionFileName, textContent || '', {
                    contentType: 'text/plain'
                }).then(() => {
                    Storage.put(currentScriptContentFileName, scriptContent || '', {
                        contentType: 'text/plain'
                    }).then(() => {
                        window.location.href = '/Editing?scriptid='+scriptid+'&title='+title;
                    })
                })
            })
        });
    }

    // make sure versions exist before selecting one
    if(scriptid && data?.getScriptVersions) {
        
        return (
            <>
                <div>
                    <Typography variant="h4" sx={{marginTop: '1%', marginBottom: '1%', backgroundColor: '#f1efee', fontFamily: 'MuseoSlab'}}>Version History for {title}</Typography>

                    <div style={{ flexGrow: 1 }}>
                        <Grid sx={{ flexGrow: 1 }} container justifyContent="center" spacing={8}>
                            
                            <Grow in key='VersionPane' timeout={1000}>
                                <Grid item>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                        width: window.innerWidth * 0.2,
                                        backgroundColor: '#f1efee',
                                        }}
                                    >
                                        <Stack direction="column" sx={{'& > :not(style)': { m: 1 }}}>
                                            <Fab variant="extended" onClick={returnToEditing}>
                                                <KeyboardReturn />
                                                Return to Editing
                                            </Fab>
                                            <Fab variant="extended" onClick={recoverSelectedVersion} disabled={scriptContent === undefined}>
                                                <PlaylistAddCheck />
                                                Recover Selected Version
                                            </Fab>
                                        </Stack>
                                        
                                        <Paper
                                        elevation={0}
                                        sx={{
                                            flexWrap: 'wrap',
                                            borderRadius: '5px',
                                            width: window.innerWidth * 0.2,
                                            height: window.innerHeight * 0.6,
                                            overflow: 'auto',
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
                                            <Stack direction='column' >
                                                { data.getScriptVersions.map((item, index) => (
                                                    <Grow in key={index} timeout={1000 + index * 150}>
                                                        <div style={{marginLeft: '-5%',marginRight: '5%', marginTop: '5%', marginBottom: '5%'}}>
                                                            <Version 
                                                                versionid={item?.versionid} 
                                                                time_saved={item?.time_saved} 
                                                                onSetScriptContent={setScriptContent}
                                                                scriptid={scriptid}
                                                                />
                                                        </div>
                                                    </Grow>
                                                    ))
                                                }
                                            </Stack>
                                        </Paper>
                                    </Paper>
                                </Grid>
                            </Grow>

                            <Grow in key='EditingPane' timeout={1500}>
                                <Grid item>
                                    <TextField
                                    id="outlined-multiline-static"
                                    multiline
                                    // height of 1 row = 56px, so adjust accordingly
                                    rows={window.innerHeight * 0.9 / 28}
                                    variant="outlined"
                                    sx={{
                                        width: window.innerWidth * 0.6,
                                        '& fieldset': {
                                            borderRadius: '15px'
                                        }
                                    }}
                                    value={scriptContent}
                                    defaultValue='Please select a version.'
                                    style={textStyle}
                                    data-testid='scriptContent'
                                    />
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