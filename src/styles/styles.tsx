import { createTheme, styled } from '@mui/material';


export const StyledTheme = createTheme({
    typography: {
      allVariants: {
        fontFamily: "sans-serif",
      }
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            background: 'white',          
          }
        }
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            // background: "#ebb412",
          }
        }
      },
      MuiGrid: {
        styleOverrides: {
          root: {
            color: "grey",
            // border: "2px solid",
            textDecoration: "italic",
            padding: 20,
            backgroundColor: 'f1efee',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: "white",
            alignContent: "center",
            backgroundColor: "rgb(167, 11, 40)",
            borderRadius: 10,
            height: 55,
            textAlignLast: "center",
            size: "large",
            "&:hover": {
              color: "black",
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {},
          h1: {
            fontSize: 30,
            textAlignLast: "center",
            
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& fieldset': {
                borderRadius: '15px'
            },
            // for changing the color of the textfield box
            // "& .MuiOutlinedInput-root": {
            //     "&.Mui-focused fieldset": {
            //         borderColor: "red"
            //     }
            // }
          },
        },
      },
      MuiFab: {
        styleOverrides: {
            root: {
                // color: "white",
                // backgroundColor: "rgb(167, 11, 40)",
            }
        }
      }
    },
  });