import React, { useState, useEffect, useRef } from 'react';
import { Storage } from 'aws-amplify';
import { Button, Alert, Snackbar } from '@mui/material';
import { useSaveRecordingMutation } from '../generated/graphql';
import { v4 as uuidv4 } from 'uuid';
import { useCreateScriptVersionMutation } from '../generated/graphql';

interface MakeVersionButtonProps {
    scriptid: string;
    scriptContent: string;
    onShowNotification: (severity: 'success' | 'info' | 'warning' | 'error', message: string) => void;
}

function MakeVersionButton({ scriptContent, scriptid, onShowNotification }: MakeVersionButtonProps) {
    const [createScriptVersion] = useCreateScriptVersionMutation();
    const [isMakingVersion, setIsMakingVersion] = useState<boolean>(false);

    const makeVersion = () => {
        const errorNotificationText = 'Error saving version, please try again.';
        const successNotificationText = 'Version saved successfully!';
        const uniqueString = uuidv4();
        setIsMakingVersion(true);

        createScriptVersion({
            variables: {
                scriptid: scriptid || '',
                title: uniqueString,
            }
        }).then(() => {
            const userid = localStorage.getItem('userid');
            const fileName = "userid-"+userid+ "/scriptid-" + scriptid + "/versions/"+uniqueString+".txt";
            Storage.put(fileName, scriptContent || '', {
                contentType: 'text/plain'
            }).then(() => {
                onShowNotification('success', successNotificationText);
            }).catch(() => {
                onShowNotification('error', errorNotificationText);
            });
        }).catch(() => {
            onShowNotification('error', errorNotificationText);
        }).finally(() => {
            setIsMakingVersion(false);
        });
    }


  return (
    <div>
      <Button onClick={makeVersion} disabled={isMakingVersion}>
        Make Version
      </Button>
    </div>
  );
}

export default MakeVersionButton;