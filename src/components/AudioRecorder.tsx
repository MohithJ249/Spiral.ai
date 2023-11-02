import React, { useState, useEffect, useRef } from 'react';
import { Storage } from 'aws-amplify';
import { Box, Button, Card, CardContent, CardMedia, IconButton, Input, LinearProgress, Paper, Slider, Stack, Tooltip, Typography, styled  } from '@mui/material';
import { Pause, PlayArrow, NotStarted, RecordVoiceOver, StopCircle, Save, VolumeUp, VolumeDown, Waves } from '@mui/icons-material';
import { useSaveRecordingMutation } from '../generated/graphql';
import { time } from 'console';

interface AudioRecorderProps {
  scriptid: string;
  scriptTitle?: string;
  onShowNotification: (severity: 'success' | 'info' | 'warning' | 'error', text: string) => void;
}

function AudioRecorder({ scriptid, scriptTitle, onShowNotification }: AudioRecorderProps) {
  const [stream, setStream] = useState<MediaStream>();
  const [recording, setRecording] = useState(false);
  const [recordingName, setRecordingName] = useState<string>();
  const [audioUrl, setAudioUrl] = useState<string>();
  const mediaRecorderRef = useRef<MediaRecorder>();
  const audioChunks = useRef<Blob[]>([]);
  const [saveRecordingInDatabase, { loading, error }] = useSaveRecordingMutation();

  // for audio player
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    if (recording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [recording]);

  var getDuration = function (url: any, next: any) {
    var _player = new Audio(url);
    _player.addEventListener("durationchange", function (e) {
        if (this.duration!=Infinity) {
           var duration = this.duration
           _player.remove();
           next(duration);
        };
    }, false);      
    _player.load();
    _player.currentTime = 24*60*60;
    _player.volume = 0;
};

  useEffect(() => {
    getDuration (audioUrl, function (duration: any) {
      setDuration(duration)
  });
  }, [audioUrl]);

  const formatTime = (time: number) => {
    if(time && !isNaN(time) && isFinite(time)) {
      const minutes = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : Math.floor(time / 60);
      const seconds = Math.floor(time % 60) < 10 ? `0${Math.floor(time % 60)}` : Math.floor(time % 60);

      return `${minutes}:${seconds}`;
    }
    return "00:00";
  }

  const startRecording = async () => {
    try {
        audioChunks.current = [];
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setStream(stream);
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorderRef.current.ondataavailable = (e: BlobEvent) => {
            if (e.data.size > 0) {
                audioChunks.current.push(e.data);
            }
        };

        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
            const newURL = URL.createObjectURL(audioBlob);
            setAudioUrl(newURL);
            
            if(audioRef.current && newURL) {
              audioRef.current.src = newURL;
            }
        };

        mediaRecorderRef.current.start();
    } catch (error) {
        console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if(stream)
        stream.getTracks().forEach((track) => track.stop());
    }
  };

  const saveRecording = () => {
    if(recordingName) {
      // First save recording to database to ensure no duplicate names
      saveRecordingInDatabase({
        variables: {
          scriptid: scriptid,
          title: recordingName,
        }
      }).then(() => {
        // Save recording to S3
        const userid = localStorage.getItem('userid');
        const fileName = "userid-"+userid+ "/scriptid-" + scriptid + "/recordings/"+recordingName+".wav";
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        Storage.put(fileName, audioBlob, {
          contentType: 'audio/wav',
          level: 'public',
        }).then(() => {
          setRecordingName('');
          setAudioUrl('');         
          onShowNotification('success', 'Recording saved successfully.'); 
        }).catch((error) => {
          onShowNotification('error', 'Error saving recording: ' + error.message);
        });
      }).catch((error) => {
        if(error.message.includes('duplicate key value violates unique constraint "uq_scriptid_title"'))
          onShowNotification('error', 'A recording with that name already exists. Please choose a different name.');
      });
    }
  }

  const saveRecordingDisabled = () => {
    return !audioUrl || recordingName === undefined || recordingName === '' || loading;
  }

  const goToRecordings = () => { 
    window.location.href = '/Recordings?title=' + scriptTitle + '&scriptid=' + scriptid;
  }

  // styling audio player

  const styledDiv = {
    height: '100%',
    width: '100%',
    paddingTop: '6px',
  }

  interface paperProps {
    theme?: any;
  }

  
  const styledPaper = {
    backgroundColor: '#4d4d4d',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  };

  interface sliderProps {
    theme?: any;
    thumbless?: boolean;
  }

  const PlayBar = styled(Slider)<sliderProps>(({ theme, ...otherProps }) => ({
    color: 'silver',
    height: 2,
    '&:hover': {
      cursor: 'auto',
    },
    '& .MuiSlider-thumb': {
      width: '14px',
      height: '14px',
      display: otherProps.thumbless ? 'none' : 'block'
    }
  }))
  

  const MyVolSliderTag = () => {
    const [volume, setVolume] = useState(70);
    const handleVolume = (e: Event, newValue: number | number[]): void => {
      // const { value } = e.target;
      let currVolume = Number(newValue);
      if(audioRef.current) {
        audioRef.current.volume = currVolume / 100;
        setVolume(currVolume);
      }
    }

    return (
      <Box sx={{ width: 200 }}>
        <Stack direction='row' spacing={1}
            sx={{
              display : 'flex',
              justifyContent: 'flex-start',
              width: '70%',
              alignItems: 'center',
            }}>         
            <VolumeDown />
            <PlayBar
              min={0}
              max={100}
              value={volume}
              onChange={handleVolume}
              defaultValue={70}
              />
            <VolumeUp />
        </Stack>
      </Box>
    );
  }

  const togglePlay = () => {
    if(!isPlaying) {
      audioRef.current?.play();
    }
    else {
      audioRef.current?.pause();
    }
    setIsPlaying(!isPlaying);
  }

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setElapsed(audioRef.current.currentTime);
    }
  };

  return (
    <>
      <Paper sx={styledPaper}>
        <Stack direction='row' spacing={1} sx={{
          justifyContent: 'center'}}>
          <Input placeholder="Recording Name" style={{color: 'white'}} value={recordingName} onChange={(e) => setRecordingName(e.target.value)} />
        </Stack>
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
          <Stack direction='row' spacing={1}
            sx={{
              display : 'flex',
              justifyContent: 'center',
              width: '40%',
              alignItems: 'center',
            }}>
              <Tooltip title="Record">
                <RecordVoiceOver sx={{
                  color:'silver',
                  '&:hover': {color: 'white'}}}
                              onClick={() => setRecording(!recording)}/>
              </Tooltip>

              <Tooltip title="Play/Pause">
                {!isPlaying ? (<PlayArrow onClick={togglePlay} sx={{
                              fontSize: '80px',
                              color:'silver',
                              '&:hover': {color: 'white'}}}
                            />)
                            : (<Pause onClick={togglePlay} sx={{
                              fontSize: '80px',
                              color:'silver',
                              '&:hover': {color: 'white'}}}/>)
                            }
              </Tooltip>

              <Tooltip title="Save">
                <span>
                  <IconButton onClick={saveRecording} disabled={saveRecordingDisabled()}>
                    <Save sx={{color:'silver', '&:hover': {color: 'white'}}}/>
                  </IconButton>
                </span>
              </Tooltip>
          </Stack>
        </Box>
        <Stack spacing={1} direction='row' sx={{
          display : 'flex',
          width: '100%',
          alignItems: 'center',
        }}>
          <Typography sx={{color: 'silver'}}>{formatTime(elapsed)}</Typography>
          <PlayBar thumbless value={elapsed} max={duration} onChange={(e, newValue) => {
            if(audioRef.current)
              audioRef.current.currentTime = newValue as number;
          }
          }/>
          <Typography sx={{color: 'silver'}}>{formatTime(duration - elapsed)}</Typography>
        </Stack>
        <MyVolSliderTag />
        <audio 
          className='my-audio' 
          src={audioUrl}
          ref={audioRef} 
          onTimeUpdate={onTimeUpdate}></audio>
        <Button onClick={goToRecordings}>View All Recordings</Button>
      </Paper>
    </>
  );
}

export default AudioRecorder;