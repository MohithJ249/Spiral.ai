import '../../components/selectionPage';
import React, { useState, useEffect } from 'react';
import { useLoginLazyQuery } from '../../generated/graphql';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { ApolloError } from '@apollo/client';

export default function LoginPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorText, setErrorText] = useState<string | null>(null);
    const [login, { data, loading, error }] = useLoginLazyQuery();

    if(localStorage.getItem('userid') && localStorage.getItem('username'))
        window.location.href = '/mydocs';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        login({
            variables: { email, password },
        });
    };

    useEffect(() => {
        if (!error && data?.login?.userid) {
            setErrorText(null);
            localStorage.setItem('userid', data.login.userid);
            localStorage.setItem('username', data.login.username);
            window.location.href = '/mydocs';
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            setErrorText("Error: " + error.message);
        }
    }, [error]);

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
            SPIRAL.AI 
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
              value={email} onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading} onClick={handleSubmit}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
        // <div className='login-container'>
        //     {errorText && <Alert severity="error">{errorText}</Alert>}
        //         <br /><br />
        //         <FormControl>
        //             <InputLabel>Email</InputLabel>
        //             <Input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
        //         </FormControl>
        //         <br /><br />
        //         <FormControl>
        //             <InputLabel>Password</InputLabel>
        //             <Input type='text' value={password} onChange={(e) => setPassword(e.target.value)} />
        //         </FormControl>
        //         <br /><br />
        //         <Button type='submit' disabled={loading} onClick={handleSubmit}>Login</Button>
        // </div>
    );
}