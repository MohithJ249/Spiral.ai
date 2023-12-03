import { createTheme } from '@mui/material';

export const commentsStyling = {
  backgroundColor: '#edf2fa',
  color: 'black',
  display: 'flex',
  flexDirection: 'column',
  marginLeft: '-5%',
  marginRight: '5%', 
  marginTop: '5%', 
  marginBottom: '5%',
  borderRadius: '15px',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  '&:hover':{
      backgroundColor: '#e7edf8'
  }
};

export const cardContentStyling = {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
};

export const deleteButtonCommentsStyling = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  color: 'black', 
};

export const timeSavedCommentsStyling = {
  fontSize: '0.75rem',
  color: 'black', 
  marginBottom: '8px', // spacing between time and content
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const textContentCommentsStyling = {
  color: 'black', 
  wordBreak: 'break-word', // to prevent overflow
};

export const textContentStylingItalic = {
  color: 'black', 
  wordBreak: 'break-word', // to prevent overflow
  fontStyle: 'italic',
  marginBottom: '8px',
};

export const usernameCommentsStyling = {
  fontWeight: 'bold',
  color: 'black', 
};

export const StyledTheme = createTheme({
    typography: {
      allVariants: {
        fontFamily: "sans-serif",
      }
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            backgroundColor: 'white',
            borderRadius: '15px',
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderRadius: '15px',
            },
          },
        },
      },
      MuiFab: {
        styleOverrides: {
            root: {
              color: 'white',
              backgroundColor: '#4d4d4d',
              '&:hover': { 
                  color: 'white',
                  backgroundColor: 'black',
                  
              }
            }
        }
      }
    },
  });
