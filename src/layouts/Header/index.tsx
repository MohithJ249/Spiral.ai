
import {
  Box,
  Stack,
  styled,
} from '@mui/material';

import HeaderButtons from './TopRightBox';
import HeaderUserbox from './TopRightBox/Userbox';
import HeaderMenu from './Menu';
import { Outlet } from 'react-router-dom';
import { Grass } from '@mui/icons-material';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: '100%';
        z-index: 6;
        background-color: #1976d2;
        backdrop-filter: blur(3px);
        position: fixed;
        justify-content: space-between;
        width: 100%;
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: ${theme.spacing(0, 1)};
`
);

// returns layout of header
function getNavbar() {
  if(localStorage.getItem('userid') === null || localStorage.getItem('username') === null) {
    return <></>
  }
  else {
    return (
      <>
        <Box sx={{ position: 'relative' }}>
          <Box sx={{
              position: 'fixed',
              marginTop: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
            }}>
            <Grass
              fontSize='large'
              style={{
                color: 'white',
              }}
              />
          </Box>
          <HeaderWrapper
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            margin='auto'
            zIndex={5}
            sx={{
              boxShadow: '0 8px 8px 5px #f1efee',
              // paddingTop: '48px',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
            >
              <HeaderMenu />
            </Stack>
            <HeaderButtons />
            <HeaderUserbox />
          </HeaderWrapper>
        </Box>
      </>
      
    );
  }
}

function Header() {

  return (
    <>
      {getNavbar()}
      
      <Box
        sx={{
          position: 'relative',
          zIndex: 5,
          display: 'block',
          flex: 1,
          pt: '80px',
          justifyContent: 'center',
          backgroundColor: '#f1efee',
          minHeight: '100vh',
          // marginTop: '5%',
          // margin: '0px 0px 0px 40px',
        }}
      >
        <Box display="block" sx={{ justifyContent : 'center', margin: 'auto' }}>
          {/* all other pages will fall under outlet */}
          <Outlet />

        </Box>
      </Box>
    </>
  );
}

export default Header;
