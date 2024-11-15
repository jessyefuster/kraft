import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import KeyIcon from '@mui/icons-material/Key';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import { redirect } from 'react-router-dom';

import PrivateOutlet from '../../features/Auth/components/PrivateOutlet/PrivateOutlet';
import LoginPage from '../../features/Auth/pages/LoginPage';
import RolePage from '../../features/Roles/pages/RolePage';
import RolesPage from '../../features/Roles/pages/RolesPage';
import UsersPage from '../../features/Users/pages/UsersPage';
import HomePage from '../../pages/Home';
import NotFoundPage from '../../pages/NotFound';
import type { Route } from '../models/route';

export const routes: Route[] = [
  {
    path: '/login',
    element: <LoginPage title="Connexion" />,
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
        element: <HomePage title="Accueil" />,
        meta: {
          title: 'Apps',
          iconElement: <LayersRoundedIcon />
        }
      },
      {
        path: 'users',
        element: <UsersPage title="Utilisateurs" />,
        meta: {
          title: 'Utilisateurs',
          iconElement: <PeopleRoundedIcon />
        }
      },
      {
        path: 'roles',
        meta: {
          title: 'Rôles',
          iconElement: <KeyIcon />
        },
        children: [
          {
            index: true,
            element: <RolesPage title="Rôles" />
          },
          {
            path: ':id',
            element: <RolePage />,
          }
        ]
      }
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
