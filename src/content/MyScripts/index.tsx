import {
    Card,
    Grid,
    Box,
    CardContent,
    Typography,
    CardActionArea,
    Grow,
  } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { useGetAllUserScriptsQuery } from '../../generated/graphql';
import CircularLabelWithProgress from '../../components/loadingAnimation';

  interface CustomCardProps {
    title?: string;
    lastModified?: string;
    scriptid?: string;
  }
  
  function CustomCard({title, scriptid, lastModified}: CustomCardProps) {
    const location = useLocation();

    const CardStyle = {
      borderRadius: '30px',
      transition: 'transform 0.5s ease', 
      '&:hover': {
        transform: "scale(1.1)",
      },
    }
    

    return (
      <Card sx={CardStyle}>
        <CardActionArea component={NavLink}   to={{pathname: `/Editing`,search: `?title=${title}&scriptid=${scriptid}`,}}>
          <CardContent sx = {{color: 'black'}}>
            <Typography variant="h5" noWrap sx={{ fontFamily: "TimesNewRoman"}}>
              {title}
            </Typography>
            <Typography variant="h6" noWrap sx={{ fontFamily: "TimesNewRoman"}}>
              Last Modified: {lastModified}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }

  export default function MyScripts() {
    const { data } = useGetAllUserScriptsQuery({variables: { userid: localStorage.getItem('userid') || '' }});

    if(data?.getAllUserScripts?.length===0) {
      return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
          <Typography variant="h4" noWrap sx={{ fontFamily: "TimesNewRoman"}}>
            You have no scripts
          </Typography>
        </Box>
      )
    }
    else if(data?.getAllUserScripts) {
      return (
        <>
          <Box sx={{flexWrap: 'wrap', display: 'flex', bgcolor: '#f1efee' }}>
            <Grid 
              container 
              spacing={3} 
              direction='row' 
              justifyContent='flex-start'
              padding={4}
              >
                { data.getAllUserScripts.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Grow in key={index} timeout={1000 + index * 150}>
                      <div>
                        <CustomCard title={item?.title} lastModified={item?.last_modified} scriptid={item?.scriptid}/>
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