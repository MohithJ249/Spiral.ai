import { Typography, Modal, Box, Grow, Fab, Tooltip, Stack } from '@mui/material';
import { useState } from 'react';
import { Check, Close, Delete } from '@mui/icons-material';

interface DeleteModalProps {
  onDelete: () => void;
  deleteText: string;
}

function DeleteModal({ onDelete, deleteText }: DeleteModalProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

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
    margin: 'auto',
  };

  // to add confirmation for deleting script
  return (
    <div>
      <Tooltip title="Delete Script">
        <Fab size="small" onClick={() => setModalOpen(true)} sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: '#ff7276' } }}>
          <Delete />
        </Fab>
      </Tooltip>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grow in={modalOpen} timeout={750}>
          <Box sx={modalStyle}>
            <Typography sx={{ textAlign: 'center', marginBottom: '5%'}}>{deleteText}</Typography>
            <Stack direction='row' spacing={2} justifyContent={'center'}>
              <Fab variant='extended' onClick={onDelete} sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: '#ff7276' } }}><Check />Yes</Fab>
              <Fab variant='extended' onClick={() => setModalOpen(false)}><Close />No</Fab>
            </Stack>
          </Box>
        </Grow>
      </Modal>
    </div>
  );
}

export default DeleteModal;