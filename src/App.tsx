import React from 'react';
import logo from './logo.svg';
import './App.css';
import MyDocs from './content/MyDocs';
import { useRoutes } from 'react-router-dom';
import router from './router';
import { CssBaseline } from '@mui/material';
// import MyDocs from './dashboard/MyDocs';

function App() {
  const content = useRoutes(router);

  return (
    <div className="App">
      <CssBaseline />
      {content}
    </div>
  );
}

export default App;
