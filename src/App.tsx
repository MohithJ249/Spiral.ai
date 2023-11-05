import React from 'react';
import { ApolloProvider } from '@apollo/client';
import logo from './logo.svg';
import './App.css';
import { useRoutes } from 'react-router-dom';
import router from './router';
import { ThemeProvider, CssBaseline } from '@mui/material';
// import MyDocs from './dashboard/MyDocs';
import client from './graphql/client';
import { Amplify } from 'aws-amplify';
import { StyledTheme } from './styles/styles';

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

function App() {
  const content = useRoutes(router);

  return (
    <div className="App">
       <ApolloProvider client={client}>
        {/* <ThemeProvider theme={StyledTheme}> */}
          <CssBaseline />
          {content}
        {/* </ThemeProvider> */}
        </ApolloProvider>
    </div>
  );
}

export default App;
