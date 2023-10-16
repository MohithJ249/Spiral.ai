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
import { useGetAllUserScriptsQuery } from '../generated/graphql';

interface CustomCardProps {
  title?: string;
  lastModifiedDate?: string;
  collaborators?: string[];
}

function CustomCard({title}: CustomCardProps) {
  // const trial = 'testing passing parameters between pages'
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <Card
      sx={{
        // px: 1
      }}
    >
      {/* Maybe have the first 4 lines of each script displayed and then a small bar below showing name
      of the script and last modified date*/}
      <CardActionArea component={NavLink} to={`/Editing${currentPath + "'s Page:" + title}`}>
        <CardContent>
          <Typography variant="h5" noWrap>
            {title}
          </Typography>
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
    const { data, loading, error } = useGetAllUserScriptsQuery({variables: { userid: localStorage.getItem('userid') || '' }});
    console.log(data);


    if(data?.getAllUserScripts) {
      return (
        <>
          <Box sx={{ flexWrap: 'wrap', display: 'flex'}}>
            <Grid 
              container 
              spacing={3} 
              direction='row' 
              justifyContent='flex-start'
              alignItems='flex-start'>
                { data.getAllUserScripts.map((item, index) => (
                  <Grid xs={12} sm={6} md={3} item>
                    <Grow in key={index} timeout={1000 + index * 150}>
                      <div>
                        <CustomCard title={item?.title} lastModifiedDate={new Date().toDateString()} collaborators={['Gordo']}/>
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
    else
      return (<>Loading</>)
  }

  
  export default Selection;
  