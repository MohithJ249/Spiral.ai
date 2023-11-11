import { Button, Typography, Modal, Box, Input, Grow, Fab, Tooltip, TableContainer, Paper, Table, TableBody, TableRow, TableCell, Card, CardContent, IconButton, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import {useAddCollaboratorMutation, useRemoveCollaboratorMutation, useGetAllScriptCollaboratorsLazyQuery } from '../generated/graphql';
import { ApolloError } from '@apollo/client';
import { Check, Close, Share } from '@mui/icons-material';
import { cardContentStyling, commentsStyling, deleteButtonCommentsStyling, textContentCommentsStyling, timeSavedCommentsStyling, usernameCommentsStyling } from '../styles/styles';

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
        const headerStyling = {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        };
        return <>{data?.getAllScriptCollaborators?.map(collaborator => {
                        if(collaborator?.email && collaborator?.username) {
                            return (
                                <Card key={collaborator.username} sx={{width: ' 100%', ...commentsStyling}}>
                                    <CardContent sx={cardContentStyling}>
                                        <Box sx={headerStyling}>
                                            <Typography variant="subtitle1" sx={usernameCommentsStyling}>{collaborator.username}</Typography>
                                            <IconButton onClick={()=>removeCollaborator(collaborator.email)} sx={{ marginTop: '-2%', ...deleteButtonCommentsStyling }}>
                                                <Close />
                                            </IconButton>
                                        </Box>
                                        <Typography variant="body2" sx={textContentCommentsStyling}>{collaborator.email}</Typography>
                                    </CardContent>
                                </Card>
                            );
                        }
                    })}
                </>
    }

  return (
    <div>
        <Tooltip title="Share Script">
            <Fab size='small' onClick={()=>setModalOpen(true)}>
                <Share />
                </Fab>
        </Tooltip>
        <Modal
            open={modalOpen}
            onClose={()=>setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                margin: 'auto',
                top: '-20%'
            }}
            >
            <Grow in={modalOpen} timeout={750}>
                <Box sx={modalStyle}>
                    <IconButton onClick={() => setModalOpen(false)} sx={{ marginTop: '-2%', ...deleteButtonCommentsStyling }}>
                        <Close />
                    </IconButton>
                    <Stack direction="column" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography sx={{ textAlign: 'center', marginBottom: '3%' }}>Add a collaborator:</Typography>
                        <Input placeholder="Enter Email" sx={{marginBottom: '3%', width: '70%'}} value={shareScriptInput} onChange={(e) => setShareScriptInput(e.target.value)} />
                        <Fab variant="extended" sx={{marginBottom: '3%'}} onClick={addCollaborator} disabled={!shareScriptInput}>
                            <Check />
                            Share
                        </Fab>
                    </Stack>
                    <Typography sx={{ marginTop: 2, textAlign: 'center' }}>Current Collaborators:</Typography>

                    <Paper
                        elevation={0}
                        sx={{
                            flexWrap: 'wrap',
                            borderRadius: '5px',
                            width: window.innerWidth * 0.2,
                            height: window.innerHeight * 0.2,
                            overflow: 'auto',
                            maxHeight: '40%',
                            '&::-webkit-scrollbar': {
                            width: '0.5rem', 
                            },
                            '&::-webkit-scrollbar-thumb': {
                            background: '#aaa', // Color of the scrollbar thumb
                            borderRadius: '2px', // Adjust as needed
                            },
                            '&::-webkit-scrollbar-thumb:hover': {
                            background: '#aaa', // Color on hover, adjust as needed
                            },
                        }}
                        component="ul"
                        >
                        {displayCollaborators()}
                    </Paper>
                </Box>
            </Grow> 
        </Modal>
    </div>
  );
}

export default CollaboratorModal;