import { MouseEventHandler, useContext } from 'react';

import {
  Box,
  alpha,
  Stack,
  lighten,
  Divider,
  IconButton,
  Tooltip,
  styled,
  useTheme
} from '@mui/material';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { SidebarContext } from '../../contexts/SidebarContext';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';

import HeaderButtons from './TopRightBox';
import HeaderUserbox from './TopRightBox/Userbox';
import HeaderMenu from './Menu';
import { Outlet } from 'react-router-dom';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: '100%';
        padding: ${theme.spacing(0, 2)};
        right: 0;
        z-index: 6;
        background-color: #1976d2;
        backdrop-filter: blur(3px);
        position: fixed;
        justify-content: space-between;
        width: 100%;
        color: white;
`
);

function getNavbar(sidebarToggle: boolean, toggleSidebar: MouseEventHandler<HTMLButtonElement> | undefined) {
  if(localStorage.getItem('userid') === null || localStorage.getItem('username') === null) {
    return <></>
  }
  else {
    return <HeaderWrapper
      display="flex"
      alignItems="center"
      sx={{
        boxShadow: '0 8px 8px 5px white'
      }}
    >
      {/* add these two lines to center the menu */}
      {/* <Stack />
      <Stack /> */}
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        alignItems="center"
        spacing={2}
      >
        <HeaderMenu />
      </Stack>
      <Box display="flex" alignItems="center">
        <HeaderButtons />
        <HeaderUserbox />
        <Box
          component="span"
          sx={{
            ml: 2,
            display: { lg: 'none', xs: 'inline-block' }
          }}
        >
          <Tooltip arrow title="Toggle Menu">
            <IconButton color="primary" onClick={toggleSidebar}>
              {!sidebarToggle ? (
                <MenuTwoToneIcon fontSize="small" />
              ) : (
                <CloseTwoToneIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </HeaderWrapper>
  }
}

function Header() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  return (
    <>
      {getNavbar(sidebarToggle, toggleSidebar)}
      
      <Box
        sx={{
          position: 'relative',
          zIndex: 5,
          display: 'block',
          flex: 1,
          pt: '80px',
          justifyContent: 'center',
          backgroundColor: '#f1efee'
          // marginTop: '5%',
          // margin: '0px 0px 0px 40px',
        }}
      >
        <Box display="block" sx={{ justifyContent : 'center', margin: 'auto', marginTop: '2%'}}>
          <Outlet />

        </Box>
      </Box>
    </>
  );
}

export default Header;
