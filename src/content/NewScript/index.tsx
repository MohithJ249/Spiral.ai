import { Button, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import * as React from 'react';


export default function NewScriptPage() {
    const [spacing, setSpacing] = React.useState(2);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSpacing(Number((event.target as HTMLInputElement).value));
    };
    // get window dimensions
    console.log(window.innerWidth, window.innerHeight);
    return (
        <>
            
            <div>
                <Typography variant="h3">Add setup page here. Check in content/NewScript/index.tsx file</Typography>    
                <TextField id='EnterTitle' label='Enter Title'></TextField>
                <TextField id='Prompt' label='Enter Prompt'></TextField>   
                <TextField id='AddtInfo' label='Enter Additional Info'></TextField> 
                <Button>Generate Script</Button>
                   
            </div>
        </>
    );
}