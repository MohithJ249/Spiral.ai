import '../../components/selectionPage';
import React, { useState, useEffect } from 'react';
import { useLoginLazyQuery } from '../../generated/graphql';
import { Button, FormControl, Input, InputLabel, TextField, Typography } from '@mui/material';

export default function LoginPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorText, setErrorText] = useState<string | null>(null);
    const [login, { loading, error, data }] = useLoginLazyQuery();

    if(localStorage.getItem('userid') && localStorage.getItem('username'))
        window.location.href = '/mydocs';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({
            variables: { email, password },
        });
    };

    useEffect(() => {
        if (data && data.login && data.login.userid) {
            setErrorText(null);
            localStorage.setItem('userid', data.login.userid);
            localStorage.setItem('username', data.login.username);
            console.log(data.login.userid);
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
            {errorText && <Typography variant='h6' color={'red'}>{errorText}</Typography>}
            {/* <FormControl onSubmit={handleSubmit}> */}
            <div className='input-group'>
                <TextField type='text' label='Username' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <br />
            <div className='input-group'>
                <TextField type='password' label='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <br />
            <Button type='submit' disabled={loading} onClick={handleSubmit}>Login</Button>
            {/* </FormControl> */}
        </div>
    );
}