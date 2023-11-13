import * as React from 'react';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function CircularProgressValue(
  props: CircularProgressProps & { value: number },
) {
  return (
<Box sx={{ position: 'relative', display: 'inline-flex' }}>
  {/* Remaining part (yellow) */}
  <CircularProgress
    variant="determinate"
    value={100} // Set value to 100 to hide the main part
    style={{
      color: '#4d4d4d',
      width: '5vw',
      height: '5vw',
      position: 'absolute',
    }}
  />
  
  {/* Main part (red) */}
  <CircularProgress
    variant="determinate"
    {...props}
    style={{
      color: 'red',
      width: '5vw',
      height: '5vw',
    }}
  />

  <Box
    sx={{
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Typography
      variant="caption"
      component="div"
      sx={{ fontSize: '1.5em' }}
    >{`${Math.round(props.value)}%`}</Typography>
  </Box>
</Box>
  );
}