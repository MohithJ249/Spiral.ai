import { Button, Grid, Grow,  Typography, Card, CardActionArea, CardContent, Box, TextField, Paper } from '@mui/material';
import { useState, useMemo, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import { useGetScriptVersionsQuery, useCreateScriptVersionMutation } from '../../generated/graphql';

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

    return (
        <Card>
            <CardActionArea onClick={populateScriptContent}>
                <CardContent>
                <Typography variant="h6" noWrap>
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
        return (
            <>
                <div>
                    <Typography variant="h3">Version History for {title}</Typography>

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
                                                
                                                <Button onClick={returnToEditing}>
                                                    Return to Editing
                                                </Button>
                                                <Button onClick={recoverSelectedVersion} disabled={scriptContent === undefined}>
                                                    Recover Selected Version
                                                </Button>
                                                <Box sx={{ flexWrap: 'wrap', display: 'flex'}}>
                                                    <Grid 
                                                    container 
                                                    spacing={3} 
                                                    direction='row' 
                                                    justifyContent='flex-start'
                                                    alignItems='flex-start'>
                                                        { data.getScriptVersions.map((item, index) => (
                                                        <Grid item>
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
                                                        </Grid>
                                                        ))
                                                        }
                                                    </Grid>
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
                                                width: window.innerWidth * 0.6,
                                            }}
                                            value={scriptContent}
                                            defaultValue='Please select a version.'
                                            style={textStyle}
                                            />
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