import { createTheme, styled } from '@mui/material';

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
  color: 'black', // Adjust if needed
};

export const timeSavedCommentsStyling = {
  fontSize: '0.75rem',
  color: 'black', // Adjust if needed
  marginBottom: '8px', // Spacing between time and content
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

export const textContentCommentsStyling = {
  color: 'black', // Adjust if needed
  wordBreak: 'break-word', // To prevent overflow
};



export const StyledTheme = createTheme({
    typography: {
      allVariants: {
        fontFamily: "sans-serif",
      }
    },
    components: {
      // MuiCard: {
      //   styleOverrides: {
      //     root: {
      //       background: 'white',          
      //     }
      //   }
      // },
      // MuiInputBase: {
      //   styleOverrides: {
      //     root: {
      //       borderRadius: 10,
      //       // background: "#ebb412",
      //     }
      //   }
      // },
      // MuiGrid: {
      //   styleOverrides: {
      //     root: {
      //       color: "grey",
      //       // border: "2px solid",
      //       textDecoration: "italic",
      //       padding: 20,
      //       backgroundColor: 'f1efee',
      //     },
      //   },
      // },
      // MuiButton: {
      //   styleOverrides: {
      //     root: {
      //       color: "black",
      //       alignContent: "center",
      //       borderRadius: "5px",
      //       height: 55,
      //       textAlignLast: "center",
      //       size: "large",
      //       "&:hover": {
      //         backgroundColor: '#ddd',
      //       },
      //       display: "inline-block",
      //       marginTop: "20px",
      //       padding: "10px 20px",
      //       border: "none",
      //       fontFamily: 'Copperplate',
      //       fontSize: '1.5rem',
      //       cursor: 'pointer',
      //       transition: "background-color 0.3s",
      //       animation: "fadeIn 1s forwards 4s", 
      //     }
      //   },
      // },

      
      // MuiTypography: {
      //   styleOverrides: {
      //     root: {},
      //     h1: {
      //       fontSize: 30,
      //       textAlignLast: "center",
            
      //     },
      //   },
      // },
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
