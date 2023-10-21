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
import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGetAllSharedScriptsQuery } from '../../generated/graphql';
import CircularLabelWithProgress from '../../components/loadingAnimation';

  interface CustomCardProps {
    title?: string;
    userid?: string;
    last_modified?: string;
    owner_username?: string | null;
    scriptid?: string;
  }
  
  function CustomCard({title, scriptid, userid, owner_username, last_modified}: CustomCardProps) {
    const location = useLocation();
    const currentPath = location.pathname;
    return (
      <Card>
        {/* Maybe have the first 4 lines of each script displayed and then a small bar below showing name
        of the script and last modified date*/}
        <CardActionArea component={NavLink}   to={{pathname: `/Editing`,search: `?title=${title}&scriptid=${scriptid}`,}}>
          <CardContent>
            <Typography variant="h5" noWrap>
              {title}
            </Typography>
            <Typography variant="h6" noWrap>
              Owner: {owner_username}
            </Typography>
            <Typography variant="h6" noWrap>
              Last Modified: {last_modified}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }

export default function SharedPage() {
    const { data } = useGetAllSharedScriptsQuery({variables: { userid: localStorage.getItem('userid') || '' }});

    if(data?.getAllSharedScripts) {
      return (
        <>
          <Typography >Welcome {localStorage.getItem('username')}</Typography>
          <Box sx={{ flexWrap: 'wrap', display: 'flex'}}>
            <Grid 
              container 
              spacing={3} 
              direction='row' 
              justifyContent='flex-start'
              alignItems='flex-start'>
                { data.getAllSharedScripts.map((item, index) => (
                  <Grid xs={12} sm={6} md={3} item>
                    <Grow in key={index} timeout={1000 + index * 150}>
                      <div>
                        <CustomCard title={item?.title} userid={item?.userid} scriptid={item?.scriptid} owner_username={item?.owner_username} last_modified={item?.last_modified}/>
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