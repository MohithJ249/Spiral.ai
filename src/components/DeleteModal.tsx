import { Button, Typography, Modal, Box, Grow, Fab, Tooltip } from '@mui/material';
import { useState } from 'react';
import { Delete } from '@mui/icons-material';

interface DeleteModalProps {
  onDeleteScript: () => void;
}

function DeleteModal({ onDeleteScript }: DeleteModalProps) {
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
            <Typography>Are you sure you want to delete this script?</Typography>
            <Button onClick={onDeleteScript}>Yes</Button>
            <Button onClick={() => setModalOpen(false)}>No</Button>
          </Box>
        </Grow>
      </Modal>
    </div>
  );
}

export default DeleteModal;