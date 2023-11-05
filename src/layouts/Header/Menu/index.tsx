import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Stack
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const ListWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        
        .MuiListItem-root {
            transition: ${theme.transitions.create(['color', 'fill'])};
            
            &.MuiListItem-indicators {
                padding: ${theme.spacing(1, 2)};
            
                .MuiListItemText-root {
                    .MuiTypography-root {
                        &:before {
                            height: 4px;
                            width: 22px;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: 2px;
                            content: "";
                            background: ${theme.palette.primary.main};
                        }
                    }
                }

                &.active,
                &:active,
                &:hover {
                    background: transparent;
                
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 1;
                                visibility: visible;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`
);

function HeaderMenu() {
  return (
    <>
      <ListWrapper
        sx={{
          display: 'flex',
          alignItems: 'center', // Align items vertically
          minHeight: '80px', // Increase the height of the header
          px: 2, // Padding on the sides
        }}
      >
        <Box sx={{ p: 1, display: 'flex', alignItems: 'center', border: '1px solid black' }}>
          {/* This box will contain the New Script button and will be positioned on the top left */}
          <ListItemButton
            component={NavLink}
            to="/NewScript"
          >
            + New Script
          </ListItemButton>
        </Box>
        {/* Spacer to push the menu items to the center */}
        <Box sx={{ flexGrow: 1 }} />


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
              primary="Shared"
              primaryTypographyProps={{ noWrap: true, textAlign: 'center' }} // Center the text
            />
          </ListItem>
        </List>
        {/* Spacer to balance the layout */}
        <Box sx={{ flexGrow: 1 }} />
      </ListWrapper>
    </>
  );
}

export default HeaderMenu;
