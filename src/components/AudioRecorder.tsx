import React, { useState, useEffect, useRef } from 'react';
import { Storage } from 'aws-amplify';
import { Button, Input, Alert } from '@mui/material';
import { useSaveRecordingMutation } from '../generated/graphql';

interface AudioRecorderProps {
  scriptid: string;
  onShowNotification: (severity: 'success' | 'info' | 'warning' | 'error', text: string) => void;
}

function AudioRecorder({ scriptid, onShowNotification }: AudioRecorderProps) {
  const [stream, setStream] = useState<MediaStream>();
  const [recording, setRecording] = useState(false);
  const [recordingName, setRecordingName] = useState<string>();
  const [audioUrl, setAudioUrl] = useState<string>();
  const mediaRecorderRef = useRef<MediaRecorder>();
  const audioChunks = useRef<Blob[]>([]);
  const [saveRecordingInDatabase, { loading, error }] = useSaveRecordingMutation();

  useEffect(() => {
    if (recording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [recording]);

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
            setAudioUrl(URL.createObjectURL(audioBlob));
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

  return (
    <div>
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