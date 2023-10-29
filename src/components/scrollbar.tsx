import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { alpha, Box, useTheme } from '@mui/material';

interface ScrollbarProps {
  className?: string;
  children?: ReactNode;
}

const Scrollbar: FC<ScrollbarProps> = ({ className, children, ...others }) => {  
  return (
    <Scrollbars
    autoHide
    renderThumbVertical={() => {
        return (
          <Box
          sx={{
              width: 5,
              borderRadius: '15px',
              
              '&:hover': {
                background: `${alpha('#ffffff', 0.4)}`
              }
            }}
          />
        );
      }}
      {...others}
      >
      {children}
    </Scrollbars>
  );
};


Scrollbar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
export default Scrollbar;
