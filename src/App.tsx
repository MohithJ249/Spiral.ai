import React from 'react';
import { ApolloProvider } from '@apollo/client';
import logo from './logo.svg';
import './App.css';
import MyDocs from './content/MyDocs';
import { useRoutes } from 'react-router-dom';
import router from './router';
import { CssBaseline } from '@mui/material';
// import MyDocs from './dashboard/MyDocs';
import client from './graphql/client';
function App() {
  const content = useRoutes(router);

  return (
    <div className="App">
       <ApolloProvider client={client}>
        <CssBaseline />
        {content}
      </ApolloProvider>
    </div>
  );
}

export default App;
