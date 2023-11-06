import { createTheme, styled } from '@mui/material';


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
      // MuiTextField: {
      //   styleOverrides: {
      //     root: {
      //       '& fieldset': {
      //           borderRadius: '15px'
      //       },
      //       // for changing the color of the textfield box
      //       // "& .MuiOutlinedInput-root": {
      //       //     "&.Mui-focused fieldset": {
      //       //         borderColor: "red"
      //       //     }
      //       // }
      //     },
      //   },
      // },
      MuiFab: {
        styleOverrides: {
            root: {
              color: 'white',
              backgroundColor: 'black',
              '&:hover': { 
                  color: 'white',
                  backgroundColor: '#4d4d4d' 
              }
            }
        }
      }
    },
  });
