import { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router';
import Header from './layouts/Header';

import CircularLabelWithProgress from './components/loadingAnimation';

const Loader = (Component : any) => (props: any) =>
  (
    <Suspense fallback={<CircularLabelWithProgress />}>
      <Component {...props} />
    </Suspense>
  );

// Pages

const Landing = Loader(lazy(() => import('./content/Error/Landing')))

const MainPage = Loader(lazy(() => import('./content/MainPage')));

const MyScripts = Loader(lazy(() => import('./content/MyScripts')));

const NewScript = Loader(lazy(() => import('./content/NewScript')));

const Shared = Loader(lazy(() => import('./content/Shared')));

const ViewShared = Loader(lazy(() => import('./content/ViewShared')));

const Recordings = Loader(lazy(() => import('./content/Recordings')));

const Error = Loader(lazy(() => import('./content/Error')));

const Editing = Loader(lazy(() => import('./content/Editing')));

const Login = Loader(lazy(() => import('./content/Login')));

const CreateAccount = Loader(lazy(() => import('./content/CreateAccount')));

const VersionHistory = Loader(lazy(() => import('./content/VersionHistory')));

const routes: RouteObject[] = [
  // {
  //   path: '',
  //   element: <BaseLayout />,
  //   children: [
  //     {
  //       path: '/',
  //       element: <Login />
  //     }
  //   ]
  // },
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
        path: 'NewScript',
        element: <NewScript />
      },
      {
        path: 'Shared',
        element: <Shared />
      },
      {
        path: 'ViewShared',
        element: <ViewShared />
      },
      {
        path: 'Recordings',
        element: <Recordings />
      },
      {
        path: '/',
        element: <Landing />
      },
      {
        path: '/Login',
        element: <Login />
      },
      {
        path: '/CreateAccount',
        element: <CreateAccount />
      },
      {
        path: 'Editing',
        element: <Editing />,
      },
      {
        path: 'VersionHistory',
        element: <VersionHistory />,
      },
      {
        path: '*',
        element: <Error />
      }
    ]
  },
];

export default routes;
