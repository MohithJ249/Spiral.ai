import {
  alpha,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  Popover,
  Switch,
  Tooltip,
  Typography
} from '@mui/material';
import { useRef, useState } from 'react';
// import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled } from '@mui/material/styles';

// import { formatDistance, subDays } from 'date-fns';

const NotificationsBadge = styled(Badge)(
  ({ theme }) => `
    
    .MuiBadge-badge {
        background-color: ${alpha(theme.palette.error.main, 0.1)};
        color: ${theme.palette.error.main};
        min-width: 16px; 
        height: 16px;
        padding: 0;

        &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: 0 0 0 1px ${alpha(theme.palette.error.main, 0.3)};
            content: "";
        }
    }
`
);

function HeaderNotifications() {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip arrow title="Notifications">
        <IconButton color="primary" ref={ref} onClick={handleOpen}>
          <NotificationsBadge
            badgeContent={0}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          >
            <SettingsIcon />
          </NotificationsBadge>
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Box
          sx={{ p: 2 }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h5" align="center" >Settings</Typography>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          <ListItem
            sx={{ p: 2, minWidth: 350, display: { xs: 'block', sm: 'flex' } }}
          >
            <Box flex="1">
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">High-Contrast Mode</Typography>
                <Switch/>
              </Box>
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {' '}
                Add things like accessbility, zoom, and so on
              </Typography>
            </Box>
          </ListItem>
        </List>
      </Popover>
    </>
  );
}

export default HeaderNotifications;
