import { useContext } from 'react';
import Scrollbar from '../../../components/scrollbar';
import { SidebarContext } from '../../../contexts/SidebarContext';

import {
  Box,
  Drawer,
  alpha,
  styled,
  Divider,
  useTheme,
  Button,
  lighten,
  darken,
  Tooltip,
  Typography
} from '@mui/material';

import SidebarMenu from './SidebarMenu';
// import Logo from 'src/components/LogoSign';

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: '290px';
        min-width: '290px';
        color: #ffffff;
        position: relative;
        z-index: 7;
        height: 95%;
        // border-radius: '50px';
        padding-bottom: 50px;
`
);

function Sidebar() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
  const theme = useTheme();

  return (
    <>
      <SidebarWrapper
        sx={{
          display: {
            xs: 'none',
            lg: 'inline-block'
          },
          position: 'fixed',
          left: 0,
          top: 0,
          width: '200px',
          margin: '20px',
          borderRadius: '30px',
          background:alpha(lighten('#5569ff', 0.1), 0.5),
          boxShadow:'2px 0 3px rgba(159, 162, 191, .18), 1px 0 1px rgba(159, 162, 191, 0.32)'
        }}
      >
        <Scrollbar>
          <Box mt={3}>
            <Box
              mx={2}
              sx={{
                width: 52
              }}
            >
            </Box>
          </Box>
          <Divider
            sx={{
              mt: theme.spacing(3),
              mx: theme.spacing(2),
              background: alpha('#ffffff', 0.15)
            }}
          />
          <SidebarMenu />
        </Scrollbar>
        <Divider
          sx={{
            background: alpha('#ffffff', 1)
          }}
        />
      </SidebarWrapper>
      <Drawer
        sx={{
          boxShadow: '2px 0 3px rgba(159, 162, 191, .18), 1px 0 1px rgba(159, 162, 191, 0.32)'
        }}
        anchor='left'
        open={sidebarToggle}
        onClose={closeSidebar}
        variant="temporary"
        elevation={9}
      >
        <SidebarWrapper
          sx={{
            background: alpha('#ffffff', 0.1),
          }}
        >
          <Scrollbar>
            <Box mt={3}>
              <Box
                mx={2}
                sx={{
                  width: 52
                }}
              >
                {/* <Logo /> */}
                <Typography>Scrollbar test</Typography>
              </Box>
            </Box>
            <Divider
              sx={{
                mt: theme.spacing(3),
                mx: theme.spacing(2),
                background: alpha('#ffffff', 0.15)
              }}
            />
            <SidebarMenu />
          </Scrollbar>
        </SidebarWrapper>
      </Drawer>
    </>
  );
}

export default Sidebar;
