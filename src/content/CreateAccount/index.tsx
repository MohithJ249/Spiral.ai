import React, { useState, useEffect } from 'react';
import { useCreateUserMutation } from '../../generated/graphql';
import { Button, FormControl, Input, InputLabel, Alert } from '@mui/material';
import {  TextField, Container, Typography, Box } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { ApolloError } from '@apollo/client';

export default function CreateAccountPage() {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorText, setErrorText] = useState<string | null>(null);
    const [createUser, { loading }] = useCreateUserMutation({
        variables: { username, email, password },
    });

    if(localStorage.getItem('userid') && localStorage.getItem('username'))
        window.location.href = '/MyScripts';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await createUser();
            if (data?.createUser) {
                setErrorText(null);
                localStorage.setItem('userid', data.createUser.userid);
                localStorage.setItem('username', data.createUser.username);
                console.log(data.createUser.userid);
                window.location.href = '/MyScripts';
            }
        } 
        catch (error: any) {
            if (error instanceof ApolloError && error.message.includes("duplicate key value violates unique constraint \"unique_email\"")) {
                setErrorText("An account with this email already exists.");
            } else {
                setErrorText("Error: " + error.message);
            }
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
          <LockIcon color="primary" style={{ fontSize: 40 }} />
          <Typography component="h1" variant="h5">
            Create Account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {errorText && <Alert severity="error">{errorText}</Alert>}
          <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email} error={errorText?.includes("Please choose a different email")}  onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username} onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading} onClick={handleSubmit}
            >
              Create Account
            </Button>
          </Box>
        </Box>
      </Container>
        // <div className='create-account-container'>
        //     {errorText && <Alert severity="error">{errorText}</Alert>}
        //         <br /><br />
        //         <FormControl>
        //             <InputLabel>Email</InputLabel>
        //             <Input type='text' value={email} error={errorText?.includes("Please choose a different email")}  onChange={(e) => setEmail(e.target.value)} />
        //         </FormControl>
        //         <br /><br />
        //         <FormControl>
        //             <InputLabel>Username</InputLabel>
        //             <Input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
        //         </FormControl>
        //         <br /><br />
        //         <FormControl>
        //             <InputLabel>Password</InputLabel>
        //             <Input type='text' value={password} onChange={(e) => setPassword(e.target.value)} />
        //         </FormControl>
        //         <br /><br />
        //         <Button type='submit' disabled={loading} onClick={handleSubmit}>Create Account</Button>
        // </div>
    );
}