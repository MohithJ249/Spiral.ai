import '../../components/selectionPage';
import React, { useState, useEffect } from 'react';
import { useLoginLazyQuery } from '../../generated/graphql';
import { Typography } from '@mui/material';

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
            {errorText && <p>{errorText}</p>}
            <form onSubmit={handleSubmit}>
                <div className='input-group'>
                    <label htmlFor='username'>Username: </label>
                    <input type='text' id='username' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='input-group'>
                    <label htmlFor='password'>Password: </label>
                    <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type='submit' disabled={loading}>Login</button>
            </form>
        </div>
    );
}