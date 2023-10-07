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
    Grow,
    styled
  } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
//   import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';

interface CustomCardProps {
  bigLabel?: string;
  smallLabel?: string;
  dollars?: string;
  BTC?: string;
}

function CustomCard({bigLabel, smallLabel, dollars, BTC}: CustomCardProps) {
  // const trial = 'testing passing parameters between pages'
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <Card
      sx={{
        // px: 1
      }}
    >
      <CardActionArea component={NavLink} to={`/Editing${currentPath + "'s Page:" + bigLabel}`}>
        <CardContent>
          <Typography variant="h5" noWrap>
            {bigLabel}
          </Typography>
          <Typography variant="subtitle1" noWrap>
            {smallLabel}
          </Typography>
          <Box
            sx={{
              pt: 3
            }}
          >
            <Typography variant="h3" gutterBottom noWrap>
              {dollars}
            </Typography>
            <Typography variant="subtitle2" noWrap>
              {BTC}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
  
function Selection() {


    const bigLabel = ['Bitcoin', 'Ethereum', 'Dogecoin', 'Tether', 'Litecoin']
    const smallLabel = ['BTC', 'ETH', 'DOGE', 'T', 'LTC']
    const dollars = ['$3,586.22', '$2,586.22', '$1,586.22', '$0.58622', '$0.38622']
    const BTC = ['1.25843 BTC', '.85843 BTC', '0.25843 BTC', '0.05843 BTC', '0.01843 BTC']

    var info = [];

    for(let i = 0; i < bigLabel.length; i++) {
        info.push([bigLabel[i], smallLabel[i], dollars[i], BTC[i]])
    }

    const [showCards, setShowCards] = useState<boolean>(false);

    return (
      <>
        <Box sx={{ flexWrap: 'wrap', display: 'flex'}}>
          <Grid 
            container 
            spacing={3} 
            direction='row' 
            justifyContent='flex-start'
            alignItems='flex-start'>
              { info.map((item, index) => (
                <Grid xs={12} sm={6} md={3} item>
                  <Grow in key={index} timeout={1000 + index * 150}>
                    <div>
                      <CustomCard bigLabel={item[0]} smallLabel={item[1]} dollars={item[2]} BTC={item[3]} />
                    </div>
                  </Grow>
                </Grid>
              ))
              }
              {/* <Button>sdf</Button> */}
          </Grid>
        </Box>
      </>
    );
  }
  
  export default Selection;
  