import { Button, Grid, Grow,  Typography, Card, CardActionArea, CardContent, Box, TextField, Paper, Fab, Stack } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import { useGetScriptVersionsQuery, useCreateScriptVersionMutation } from '../../generated/graphql';
import { Create, PlaylistAddCheck } from '@mui/icons-material';
import Scrollbar from '../../components/scrollbar';

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
        Storage.get(fileName, {
            download: true,
            contentType: 'text/plain'
        }).then((fileContent) => {
            return fileContent.Body?.text();
        }).then((textContent) => {
            onSetScriptContent(textContent || '');
        })
        .catch((err) => {
            console.log(err);
        });
    }

    const styledCard2LeftPane = {
        backgroundColor: '#4d4d4d',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        // margin: '10px 0px 0px 0px',
        borderRadius: '15px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        '& > :not(style)': { m: 1 }
    }

    return (
        <Card sx={styledCard2LeftPane}>
            <CardActionArea onClick={populateScriptContent}>
                <CardContent>
                <Typography variant="subtitle1" noWrap>
                    Time Saved: {time_saved}
                </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default function VersionHistory() {
    const url = window.location.search;
    const searchParams = new URLSearchParams(url);
    const title = searchParams.get('title');
    const scriptid = searchParams.get('scriptid');

    const [scriptContent, setScriptContent] = useState<string>();
    const { data } = useGetScriptVersionsQuery({variables: { scriptid: scriptid || '' }, skip: !scriptid});
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

    if(scriptid && data?.getScriptVersions) {
        const styledCard2LeftPane = {
            backgroundColor: '#ffffff',
            display: 'flex',
            justifyContent: 'center',
            margin: '10px 0px 0px 0px',
            // padding: '20px',
            borderRadius: '15px',
            '& > :not(style)': { m: 1 }
        }

        return (
            <>
                <div>
                    <Typography variant="h3">Version History for {title}</Typography>

                    <div style={{ flexGrow: 1 }}>
                        <Grid sx={{ flexGrow: 1 }} container justifyContent="center" spacing={4}>
                            
                            <Grow in key='RecordingPane' timeout={1000}>
                                <Grid item>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                        height: window.innerHeight * 0.8,
                                        width: window.innerWidth * 0.2,
                                        backgroundColor: '#ffffff',
                                        }}
                                    >
                                        <Stack direction="column" sx={{'& > :not(style)': { m: 1 }}}>
                                            <Fab variant="extended" onClick={returnToEditing}>
                                                <Create />
                                                Return to Editing
                                            </Fab>
                                            <Fab variant="extended" onClick={recoverSelectedVersion} disabled={scriptContent === undefined}>
                                                <PlaylistAddCheck />
                                                Recover Selected Version
                                            </Fab>
                                        </Stack>
                                        
                                        <Scrollbar>
                                            <Stack direction='column' sx={styledCard2LeftPane}>
                                                { data.getScriptVersions.map((item, index) => (
                                                    <Grow in key={index} timeout={1000 + index * 150}>
                                                    <div>
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
                                        </Scrollbar>
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
                                        '& fieldset': {
                                            borderRadius: '15px'
                                        }
                                    }}
                                    value={scriptContent}
                                    defaultValue='Please select a version.'
                                    style={textStyle}
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