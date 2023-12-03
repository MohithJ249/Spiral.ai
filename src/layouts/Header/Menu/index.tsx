import {
  Box,
  List,
  ListItem,
  ListItemText,
  Fab
} from '@mui/material';
import { NavLink } from 'react-router-dom';

function HeaderMenu() {

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center', 
          minHeight: '80px', // for header
          px: 2, 
        }}
      >
        <Box sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
          {/* This box will contain the New Script button and will be positioned on the top left */}
          <Fab
            variant="extended"
            component={NavLink}
            to="/NewScript"
          
          >
            + New Script
          </Fab>
        </Box>        


        <List sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}> 
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button
            component={NavLink}
            to="/MyScripts"
            sx={{ justifyContent: 'center' }} 
          >
            <ListItemText
              primary="My Scripts"
              primaryTypographyProps={{ noWrap: true, textAlign: 'center' }} 
            />
          </ListItem>
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button
            component={NavLink}
            to="/Shared"
            sx={{ justifyContent: 'center' }} 
          >
            <ListItemText
              primary="Shared Scripts"
              primaryTypographyProps={{ noWrap: true, textAlign: 'center' }}
            />
          </ListItem>
        </List>
        {/* spacer to balance the layout */}
        <Box sx={{ flexGrow: 1 }} />
      </Box>
    </>
  );
}

export default HeaderMenu;
