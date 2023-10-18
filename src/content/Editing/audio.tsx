import React, { useState, useEffect, useRef } from 'react';
import { Storage } from 'aws-amplify';
import { Button, Input, Alert } from '@mui/material';
import { useSaveRecordingMutation } from '../../generated/graphql';

interface AudioRecorderProps {
  scriptid: string;
}

function AudioRecorder({ scriptid }: AudioRecorderProps) {
  const [stream, setStream] = useState<MediaStream>();
  const [recording, setRecording] = useState(false);
  const [recordingName, setRecordingName] = useState<string>();
  const [audioUrl, setAudioUrl] = useState<string>();
  const mediaRecorderRef = useRef<MediaRecorder>();
  const audioChunks = useRef<Blob[]>([]);
  const [saveRecordingInDatabase, { loading, error }] = useSaveRecordingMutation();
  const [errorText, setErrorText] = useState<string>();

  useEffect(() => {
    if (recording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [recording]);

  useEffect(() => {
    if (error) {
      setErrorText(error.message);
    }
  }, [error]);

  const startRecording = async () => {
    try {
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
            setAudioUrl(URL.createObjectURL(audioBlob));
            audioChunks.current = [];
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
      })
      // Then save to S3
    }

  }

  const saveRecordingDisabled = () => {
    return !audioUrl || recordingName === undefined || recordingName === '' || loading;
  }

  return (
    <div>
      {errorText && <Alert severity="error">{errorText}</Alert>}
      <Button onClick={() => setRecording(!recording)}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      <Button onClick={saveRecording} disabled={saveRecordingDisabled()}>
        Save Recording
      </Button>
      <Input placeholder="Recording Name" value={recordingName} onChange={(e) => setRecordingName(e.target.value)} />
      <audio src={audioUrl} controls />
    </div>
  );
}

export default AudioRecorder;