import '../../components/selectionPage';
import React, { useState, useEffect } from 'react';
import { useLoginLazyQuery } from '../../generated/graphql';
import { Button, FormControl, Input, InputLabel, Alert } from '@mui/material';
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
        <div className='login-container'>
            {errorText && <Alert severity="error">{errorText}</Alert>}
                <br /><br />
                <FormControl>
                    <InputLabel>Email</InputLabel>
                    <Input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
                </FormControl>
                <br /><br />
                <FormControl>
                    <InputLabel>Password</InputLabel>
                    <Input type='text' value={password} onChange={(e) => setPassword(e.target.value)} />
                </FormControl>
                <br /><br />
                <Button type='submit' disabled={loading} onClick={handleSubmit}>Login</Button>
        </div>
    );
}