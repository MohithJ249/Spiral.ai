import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Stack,
  Fab
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';

function HeaderMenu() {

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center', 
          minHeight: '80px', // for header
          px: 2, // Padding on the sides
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
        {/* Spacer to push the menu items to the center */}
        


        {/* Centered list items */}
        <List sx={{ display: 'flex', justifyContent: 'center', flex: 1 }}> {/* Adjusted for centering */}
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button
            component={NavLink}
            to="/MyScripts"
            sx={{ justifyContent: 'center' }} // Center the list item
          >
            <ListItemText
              primary="My Scripts"
              primaryTypographyProps={{ noWrap: true, textAlign: 'center' }} // Center the text
            />
          </ListItem>
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button
            component={NavLink}
            to="/Shared"
            sx={{ justifyContent: 'center' }} // Center the list item
          >
            <ListItemText
              primary="Shared Scripts"
              primaryTypographyProps={{ noWrap: true, textAlign: 'center' }} // Center the text
            />
          </ListItem>
        </List>
        {/* Spacer to balance the layout */}
        <Box sx={{ flexGrow: 1 }} />
      </Box>
    </>
  );
}

export default HeaderMenu;
