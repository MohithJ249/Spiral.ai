import React, { useState } from 'react';

interface LoginProps {
  // Add any props if needed
}

const LoginPage: React.FC<LoginProps> = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className='login-container'>
      <form onSubmit={handleSubmit}>
        <div className='input-group'>
          <label htmlFor='username'>Username: </label>
          <input type='text' id='username' value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className='input-group'>
          <label htmlFor='password'>Password: </label>
          <input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  );
};

export default LoginPage;