import { Alert, Button, FormControl, FormControlLabel, FormLabel, Grid, Paper, Radio, RadioGroup, TextField, Typography, Container, Box } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useCreateScriptMutation } from '../../generated/graphql';
import axios from 'axios';
import { Storage, Amplify } from 'aws-amplify';

Amplify.configure({
    Auth: {
      identityPoolId: 'us-east-1:2ee0929a-d64e-47db-8092-84863f078496',
      region: 'us-east-1',
    },
    Storage: {
      AWSS3: {
        bucket: 'capstone-spiral',
        region: 'us-east-1',
        identityPoolId: 'us-east-1:2ee0929a-d64e-47db-8092-84863f078496',
      },
    },
  });

export default function NewScriptPage() {
    const [spacing, setSpacing] = React.useState(2);
    const [title, setTitle] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');
    const [additionalInfo, setAdditionalInfo] = useState<string>('');

    const [createScript, { data, loading, error }] = useCreateScriptMutation();

    const [errorText, setErrorText] = useState<string | null>(null);

    

    // get window dimensions

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        if(title !== '' && prompt !== '') {
            setErrorText(null);

            // Encode the query parameter
            const queryParam = encodeURIComponent(prompt+". Make sure to include this information: "+additionalInfo+".");

            // // Build the complete URL
            const apiUrl = `https://2da9ogp80m.execute-api.us-east-2.amazonaws.com/dev/replicatelambda?prompt_input=${queryParam}`;

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                alert(this.responseText);
                }
                };

            xhttp.open("GET", apiUrl, true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send()

            // try {
            //     await Storage.put("newFile", "basic content", {
            //       contentType: 'text/plain',
            //     });
            //   } catch (error) {
            //     console.error('Error uploading file:', error);
            //   }

            // Call lambda function with state information
            // Create new s3 link file with generated text
            // const s3Link = '';
            // await createScript({
            //     variables: { 
            //         userid: localStorage.getItem('userid') || '',
            //         title: title,
            //         s3Link: s3Link,
            //     },
            // });
            // Redirect to editing page
        }
        else {
            setErrorText("Error: Please fill out all required fields.");
        }
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
                    />

                    <TextField
                    id="additionalInformation"
                    label="List any additional information that you would like to include in your script here"
                    multiline
                    rows={window.innerHeight * 0.8 / 48}
                    variant="outlined"
                    sx={{
                        height: window.innerHeight * 0.4,
                        width: window.innerWidth * 0.6,
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