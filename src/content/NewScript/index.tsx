import { Alert, Button, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, TextField, Typography, Container, Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useCreateScriptMutation } from '../../generated/graphql';
import axios from 'axios';
import { Storage } from 'aws-amplify';

export default function NewScriptPage() {
    const [spacing, setSpacing] = React.useState(2);
    const [title, setTitle] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');
    const [additionalInfo, setAdditionalInfo] = useState<string>('');

    const [createScript] = useCreateScriptMutation();
    const [loading, setLoading] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if(title !== '' && prompt !== '') {
            setErrorText(null);

            const fileName = "userid-"+localStorage.getItem('userid') + "/" + title + ".txt";
            const queryParam = encodeURIComponent(prompt+". Make sure to include this information: "+additionalInfo+".");
            const apiUrl = `https://2da9ogp80m.execute-api.us-east-2.amazonaws.com/dev/replicatelambda?prompt_input=${queryParam}`;

            const response = await axios.get(apiUrl, {
                headers: {
                'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 200) {
                const generatedScript = response.data.output;
        
                try {
                    await Storage.put(fileName, generatedScript, {
                        contentType: 'text/plain',
                    });
                } 
                catch (error) {
                    console.error('Error uploading file:', error);
                }
            
                await createScript({
                    variables: {
                        userid: localStorage.getItem('userid') || '',
                        title: title,
                    },
                });
        
                window.location.href = '/Editing/' + title;
            }
        }
        else {
            setErrorText("Error: Please fill out all required fields.");
        }
        setLoading(false);
    };
    
    return (
        <Container component="main" maxWidth="xs">
            <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 8,
            }}
            >
                <Typography component="h1" variant="h5">
                    Let your ideas spiral!
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ margin: '10px' }}>
                    {errorText && <Alert severity="error">{errorText}</Alert>}
                    <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    name="title"
                    autoFocus
                    value={title} onChange={(e) => setTitle(e.target.value)}
                    sx={{ marginTop: 2 }}
                    />
                    <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="prompt"
                    label="Prompt"
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder='Write a speech about covid'
                    sx={{ marginTop: 2 }}
                    />

                    <TextField
                    id="additionalInformation"
                    label="Additional Information"
                    placeholder='List any additional information that you would like to include in your script here'
                    multiline
                    rows={window.innerHeight * 0.8 / 48}
                    variant="outlined"
                    sx={{
                        height: window.innerHeight * 0.4,
                        width: window.innerWidth * 0.6,
                        marginTop: 2,
                    }}
                    />
                    
                    <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={loading} onClick={handleSubmit}
                    >
                    Generate Script
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}