import { useContext } from 'react';

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
        background-color: ${alpha('#11192a', 0.85)};
        backdrop-filter: blur(3px);
        position: fixed;
        justify-content: space-between;
        width: 100%;
        color: white;
`
);

function Header() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const theme = useTheme();

  return (
    <>
    
      <HeaderWrapper
        display="flex"
        alignItems="center"
        sx={{
          boxShadow: '0 8px 8px 5px lightblue'
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
      <Box
        sx={{
          position: 'relative',
          zIndex: 5,
          display: 'block',
          flex: 1,
          pt: '80px',
          // marginTop: 'auto',
          // [theme.breakpoints.up('lg')]: {
          //   ml: '100px'
          // },
          margin: '0px 100px 0px 200px',
        }}
      >
        <Box display="block" sx={{ margin: '50px 0px 0px -100px' }}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
}

export default Header;
