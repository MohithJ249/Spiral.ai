import { Button, Typography, Modal, Box, Input, Grow, Fab, Tooltip } from '@mui/material';
import { useState, useEffect } from 'react';
import {useAddCollaboratorMutation, useRemoveCollaboratorMutation, useGetAllScriptCollaboratorsLazyQuery } from '../generated/graphql';
import { ApolloError } from '@apollo/client';
import { Share } from '@mui/icons-material';

interface CollaboratorModalProps {
  scriptid: string;
  onShowNotification: (severity: 'success' | 'info' | 'warning' | 'error', text: string) => void;
}

function CollaboratorModal({ scriptid, onShowNotification }: CollaboratorModalProps) {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [shareScriptInput, setShareScriptInput] = useState<string>('');
    const [addCollaboratorMutation] = useAddCollaboratorMutation();
    const [removeCollaboratorMutation] = useRemoveCollaboratorMutation();
    const [fetchScriptCollaborators, { data, refetch: refetchScriptCollaborators }] = useGetAllScriptCollaboratorsLazyQuery();

    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '40%',
        left: '40%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        // top: '${top}%',
        margin:'auto'
    };

    useEffect(() => {
        fetchScriptCollaborators({
            variables: {
                scriptid: scriptid || ''
            }
        });
    }, []);

    const addCollaborator = async () => {
        try {
            await addCollaboratorMutation({
                variables: {
                    scriptid: scriptid || '',
                    email: shareScriptInput
                }
            });

            refetchScriptCollaborators({
                scriptid: scriptid || ''
            });
            onShowNotification('success', 'Script shared successfully!');
            setShareScriptInput('');
        }
        catch(error) {
            if(error instanceof ApolloError)
                onShowNotification('error', error.message);
            else
                onShowNotification('error', 'Error sharing script, please try again.');
        }
    }

    const removeCollaborator = async (email: string) => {
        try {
            await removeCollaboratorMutation({
                variables: {
                    scriptid: scriptid || '',
                    email: email
                }
            });
            refetchScriptCollaborators({
                scriptid: scriptid || ''
            });
            onShowNotification('success', 'Collaborator removed successfully!');
        }
        catch(error) {
            if(error instanceof ApolloError)
                onShowNotification('error', error.message);
            else
                onShowNotification('error', 'Error removing collaborator, please try again.');
        }
    }

    const displayCollaborators = () => {
        return <>{data?.getAllScriptCollaborators?.map(collaborator => {
                        if(collaborator?.email && collaborator?.username) {
                            return  <div style={{ display: 'flex' }}>
                                        <Typography>{collaborator.username} ({collaborator.email})</Typography>
                                        <Button onClick={()=>removeCollaborator(collaborator.email)} sx={{color: 'red'}}>X</Button>
                                    </div>
                        }
                    })}
                </>
    }
    const FabStyling = {
        color: 'white',
        backgroundColor: 'black',
        '&:hover': { 
            color: 'white',
            backgroundColor: '#4d4d4d' 
        }
    }

  return (
    <div>
        <Tooltip title="Share Script">
            <Fab size='small' onClick={()=>setModalOpen(true)} sx={FabStyling}>
                <Share />
                <Modal
                    open={modalOpen}
                    onClose={()=>setModalOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    >
                    <Grow in={modalOpen} timeout={750}>
                        <Box sx={modalStyle}>
                            <Typography>Add a collaborator:</Typography>
                            <Input placeholder="Enter Email" value={shareScriptInput} onChange={(e) => setShareScriptInput(e.target.value)} />
                            <Button onClick={addCollaborator} disabled={!shareScriptInput}>Share</Button>
                            <div>
                                <Typography sx={{marginTop:2}}>Current Collaborators:</Typography>
                                {displayCollaborators()}
                                
                            </div>
                        </Box>
                    </Grow> 
                </Modal>
            </Fab>
        </Tooltip>
    </div>
  );
}

export default CollaboratorModal;