import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import { redirect } from 'react-router-dom';

import PrivateOutlet from '../../features/Auth/components/PrivateOutlet/PrivateOutlet';
import LoginPage from '../../features/Auth/pages/LoginPage';
import UsersPage from '../../features/Users/pages/UsersPage';
import HomePage from '../../pages/Home';
import NotFoundPage from '../../pages/NotFound';
import type { Route } from '../models/route';

export const routes: Route[] = [
  {
    path: '/login',
    element: <LoginPage />,
    meta: {
      title: 'Connexion'
    }
  },
  {
    path: '/',
    element: <PrivateOutlet />,
    children: [
      {
        index: true,
        loader: () => redirect('/apps')
      },
      {
        path: 'apps',
        element: <HomePage />,
        meta: {
          title: 'Apps',
          iconElement: <LayersRoundedIcon />
        }
      },
      {
        path: 'users',
        element: <UsersPage title={'Utilisateurs'} />,
        meta: {
          title: 'Utilisateurs',
          iconElement: <PeopleRoundedIcon />
        }
      },
      {
        path: 'settings',
        element: <HomePage />,
        meta: {
          title: 'Paramètres',
          iconElement: <SettingsIcon />
        }
      },
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />,
    meta: {
      title: 'Page introuvable'
    }
  }
];
