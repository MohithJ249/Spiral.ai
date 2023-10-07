import { FC, ReactNode } from 'react';
import { Box, alpha, lighten, useTheme, Theme, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';
import Header from '../Header';

interface SidebarLayoutProps {
  children?: ReactNode;
}

const SidebarLayout: FC<SidebarLayoutProps> = () => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          flex: 1,
          height: '100%',

          '.MuiPageTitle-wrapper': {
            background: '#ffffff',
            marginBottom: `${theme.spacing(4)}`,
            boxShadow: `0 1px 0 ${alpha(
                    lighten(theme.palette.background.paper, 0.7),
                    0.85
                  )}, 0px 2px 4px -3px rgba(0, 0, 0, 0.2), 0px 5px 12px -4px rgba(0, 0, 0, .1)`
          }
        }}
      >
        {/* <Header /> */}
        <Typography>Testing SidebarLayout.tsx</Typography>
        <Sidebar />
        <Box
          sx={{
            position: 'relative',
            zIndex: 5,
            display: 'block',
            flex: 1,
            pt: '80px',
            [theme.breakpoints.up('lg')]: {
              ml: '290px'
            }
          }}
        >
          <Box display="block">
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SidebarLayout;
