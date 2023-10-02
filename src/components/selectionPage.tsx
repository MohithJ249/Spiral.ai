import {
    Button,
    Card,
    Grid,
    Box,
    CardContent,
    Typography,
    Avatar,
    alpha,
    Tooltip,
    CardActionArea,
    styled
  } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
//   import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

  
  
  const CardAddAction = styled(Card)(
    ({ theme }) => `
          border: #252935 dashed 1px;
          height: 100%;
          color: #252935;
          transition: ${theme.transitions.create(['all'])};
          
          .MuiCardActionArea-root {
            height: 100%;
            justify-content: center;
            align-items: center;
            display: flex;
          }
          
          .MuiTouchRipple-root {
            opacity: .2;
          }
          
          &:hover {
            border-color: ${alpha(theme.palette.primary.main, 0.8)};
          }
  `
  );
  
function Selection() {
    return (
      <>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            pb: 3
          }}
        >
          <Typography variant="h3">Scripts</Typography>
          <Button
            size="small"
            variant="outlined"
            // startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            Add new wallet
          </Button>
        </Box>
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3} item>
            <Card
              sx={{
                px: 1
              }}
            >
              <CardContent>
                <Typography variant="h5" noWrap>
                  Bitcoin
                </Typography>
                <Typography variant="subtitle1" noWrap>
                  BTC
                </Typography>
                <Box
                  sx={{
                    pt: 3
                  }}
                >
                  <Typography variant="h3" gutterBottom noWrap>
                    $3,586.22
                  </Typography>
                  <Typography variant="subtitle2" noWrap>
                    1.25843 BTC
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3} item>
            <Tooltip arrow title="Click to add a new wallet">
              <CardAddAction>
                <CardActionArea
                  sx={{
                    px: 1
                  }}
                >
                  <CardContent>
                    <AddIcon />
                  </CardContent>
                </CardActionArea>
              </CardAddAction>
            </Tooltip>
          </Grid>
        </Grid>
      </>
    );
  }
  
  export default Selection;
  