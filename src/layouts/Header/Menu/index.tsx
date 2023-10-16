import {
  Box,
  Button,
  ButtonBase,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';

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
                            border-radius: '2px';
                            content: "";
                            background: '#000000';
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
      <ListWrapper
        sx={{
          display: {
            // xs: 'none',
            // md: 'block'
          },
        }}
      >
        <List disablePadding component={Box} display="flex">
          {/* <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              size="small"
              variant="outlined"
              sx={{ whiteSpace: 'nowrap' }}
            >
              + New Script
            </Button>
          </Box> */}
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button = {true}
            component={NavLink}
            to="/NewScriptPage"
          >
            {/* don't wrap button text*/}
            <ListItemButton sx={{}}>
              + New Script
            </ListItemButton>
            {/* <Button>
              + New Script
            </Button> */}
            {/* <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="+ New Script"
            /> */}
          </ListItem>
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button
            component={NavLink}
            to="/MyScripts"
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="My Scripts"
            />
          </ListItem>
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button
            component={NavLink}
            to="/Shared"
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="Shared"
            />
          </ListItem>
          <ListItem
            classes={{ root: 'MuiListItem-indicators' }}
            button
            component={NavLink}
            to="/Recordings"
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="Recordings"
            />
          </ListItem>
        </List>
      </ListWrapper>
    </>
  );
}

export default HeaderMenu;
