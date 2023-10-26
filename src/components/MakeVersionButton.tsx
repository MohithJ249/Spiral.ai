import React, { useState, useEffect, useRef } from 'react';
import { Storage } from 'aws-amplify';
import { Button, Alert, Snackbar } from '@mui/material';
import { useSaveRecordingMutation } from '../generated/graphql';
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
        setIsMakingVersion(true);

        createScriptVersion({
            variables: {
                scriptid: scriptid || '',
            }
        }).then((result) => {
            const userid = localStorage.getItem('userid');
            const versionid = result.data?.createScriptVersion?.versionid;
            const fileName = "userid-"+userid+ "/scriptid-" + scriptid + "/versions/"+versionid+".txt";
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