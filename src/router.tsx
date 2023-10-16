import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router';

// import SidebarLayout from './layouts/SidebarLayout';
import BaseLayout from './layouts/BaseLayout';
import SidebarLayout from './layouts/SidebarLayout';
import Header from './layouts/Header';

import CircularLabelWithProgress from './components/loadingAnimation';

const Loader = (Component : any) => (props: any) =>
  (
    <Suspense fallback={<CircularLabelWithProgress />}>
      <Component {...props} />
    </Suspense>
  );

// Pages

const MainPage = Loader(lazy(() => import('./content/MainPage')));

const MyScripts = Loader(lazy(() => import('./content/MyScripts')));

const NewScript = Loader(lazy(() => import('./content/NewScript')));

const Shared = Loader(lazy(() => import('./content/Shared')));

const Recordings = Loader(lazy(() => import('./content/Recordings')));

const Error = Loader(lazy(() => import('./content/Error')));

const Editing = Loader(lazy(() => import('./content/Editing')));

const Login = Loader(lazy(() => import('./content/Login')));

const CreateAccount = Loader(lazy(() => import('./content/CreateAccount')));

const routes: RouteObject[] = [
  {
    path: '',
    element: <Header />,
    children: [
      {
        path: '/MainPage',
        element: <MainPage />
      },
      {
        path: 'MyScripts',
        element: <MyScripts />
      },
      {
        path: 'NewScriptPage',
        element: <NewScript />
      },
      {
        path: 'Shared',
        element: <Shared />
      },
      {
        path: 'Recordings',
        element: <Recordings />
      },
      {
        path: '/',
        element: <Login />
      },
      {
        path: '/CreateAccount',
        element: <CreateAccount />
      },
      {
        path: 'Editing',
        element: <Editing />,
        // Add routes to accept parameters from other pages
        children: [
          {
            path: ':extraParameter',
            element: <Editing />
          }
        ]
      },
      {
        path: '*',
        element: <Error />
      }
    ]
  },
];

export default routes;
