import React, { useState, useEffect, useRef } from 'react';
import { Storage } from 'aws-amplify';
import { Button, Alert, Snackbar } from '@mui/material';
import { useSaveRecordingMutation } from '../generated/graphql';
import { v4 as uuidv4 } from 'uuid';
import { useCreateScriptVersionMutation } from '../generated/graphql';

interface MakeVersionButtonProps {
    scriptid: string;
    scriptContent: string;
}

function MakeVersionButton({ scriptContent, scriptid }: MakeVersionButtonProps) {
    const [createScriptVersion] = useCreateScriptVersionMutation();
    const [isMakingVersion, setIsMakingVersion] = useState<boolean>(false);
    const [versionErrorOpen, setVersionErrorOpen] = useState<boolean>(false);
    const [versionSuccessOpen, setVersionSuccessOpen] = useState<boolean>(false);

    const closeAllNotifications = () => {
        setVersionErrorOpen(false);
        setVersionSuccessOpen(false);
    }

    const makeVersion = () => {
        const uniqueString = uuidv4();
        setIsMakingVersion(true);
        setVersionErrorOpen(false);
        setVersionSuccessOpen(false);

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
                setIsMakingVersion(false);
                setVersionSuccessOpen(true);
            }).catch(() => {
                setIsMakingVersion(false);
                setVersionErrorOpen(true);
            });
        }).catch(() => {
            setIsMakingVersion(false);
            setVersionErrorOpen(true);
        })
    }


  return (
    <div>
        <Snackbar open={versionErrorOpen} autoHideDuration={6000} onClose={closeAllNotifications}>
            <Alert onClose={closeAllNotifications} severity="error" sx={{ width: '100%' }}>
                Error saving version, please try again.
            </Alert>
        </Snackbar>
        <Snackbar open={versionSuccessOpen} autoHideDuration={6000} onClose={closeAllNotifications}>
            <Alert onClose={closeAllNotifications} severity="success" sx={{ width: '100%' }}>
                Version saved successfully.
            </Alert>
        </Snackbar>
      <Button onClick={makeVersion} disabled={isMakingVersion}>
        Make Version
      </Button>
    </div>
  );
}

export default MakeVersionButton;