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
import CircularLabelWithProgress from './loadingAnimation';

interface CustomCardProps {
  title?: string;
  lastModified?: string;
  collaborators?: string[];
}

function CustomCard({title, lastModified}: CustomCardProps) {
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
          <Typography variant="h6" noWrap>
            Last Modified: {lastModified}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function Selection() {
    const { data } = useGetAllUserScriptsQuery({variables: { userid: localStorage.getItem('userid') || '' }});

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
                        <CustomCard title={item?.title} lastModified={item?.last_modified} collaborators={['Gordo']}/>
                      </div>
                    </Grow>
                  </Grid>
                ))
                }
            </Grid>
          </Box>
        </>
      );
    }
    else
      return (<>{CircularLabelWithProgress}</>)
  }

  
  export default Selection;
  