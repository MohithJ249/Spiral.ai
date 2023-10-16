import { Button, Grid, Grow, Paper, TextField, Typography, recomposeColor } from '@mui/material';
import { ReactMediaRecorder, ReactMediaRecorderRenderProps } from 'react-media-recorder';
import { useParams } from 'react-router';
import { useState } from 'react';
import { preProcessFile } from 'typescript';




export default function EditingPage() {
    const {extraParameter} = useParams();

    const [startButtonClicked, setStartButtonClicked] = useState<boolean>(false);

    // make an array to store audio file urls to print all of the audio tags on screen
    // need to prefill at some point if user logs back in, backend thing
    const [recordings, setRecordings] = useState<{name: string, url: string}[]>([]);

    // to record latest audio recording's name
    const [recordingName, setRecordingName] = useState<string>('');

    const [test, setTest] = useState<boolean>(false);

    return (
        <>
            <div>
                <Typography variant="h3">Add editing page here. Check in content/Editing/index.tsx file</Typography>

                <Typography variant="h3">Test Parameter passing below</Typography>            

                <Typography variant="h3">Worked? {extraParameter}</Typography>

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
                                            <ReactMediaRecorder audio={true} render={({ status, startRecording, stopRecording, mediaBlobUrl } : ReactMediaRecorderRenderProps) => (
                                                <div>
                                                    <Typography variant="h6">{status}</Typography>
                                                    <Button onClick={() => {
                                                        setStartButtonClicked(true);
                                                        startRecording();
                                                    }}
                                                    disabled={startButtonClicked}
                                                    >
                                                        Start Recording
                                                    </Button>

                                                    <Button onClick={() => {
                                                        setStartButtonClicked(false);
                                                        stopRecording();
                                                        if (mediaBlobUrl !== null) {
                                                            if(recordingName === '' || recordingName === null) {
                                                                var date : Date = new Date();
                                                                // console.log(date.getTime().toString());
                                                                setRecordingName('Recording' + date.getTime().toString());
                                                            }
                                                            else {
                                                                setRecordingName(recordingName);
                                                            }
                                                            setRecordings((prevRecordings) => [{name: recordingName, url: mediaBlobUrl.toString()}, ...prevRecordings]);
                                                        }
                                                    }}
                                                    disabled={!startButtonClicked}
                                                    >Stop Recording</Button>
                                                    
                                                    <TextField
                                                        label="Recording Name"
                                                        onChange={(e) => setRecordingName(e.target.value)}
                                                    />

                                                    
                                                    {   recordings.length > 0 &&
                                                            recordings.map((eachRecording, index) => (
                                                                <>
                                                                    <Typography variant='h6'>Title</Typography>
                                                                    <Typography variant='h6'>{eachRecording.name}</Typography>
                                                                    <audio src={eachRecording.url} key={index} controls></audio>
                                                                </>
                                                            ))
                                                    
                                                    }
                                                </div>
                                            )}/>
                                        </Paper>
                                    </Grid>
                                </Grow>

                                <Grow in key='EditingPane' timeout={1500}>
                                    <Grid item>
                                        <TextField
                                        id="outlined-multiline-static"
                                        label="Multiline Text"
                                        multiline
                                        // height of 1 row = 56px, so adjust accordingly
                                        rows={window.innerHeight * 0.8 / 24}
                                        variant="outlined"
                                        sx={{
                                            height: window.innerHeight * 0.8,
                                            width: window.innerWidth * 0.6,
                                        }}
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