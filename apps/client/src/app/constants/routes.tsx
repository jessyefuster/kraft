import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import { redirect } from 'react-router-dom';

import PrivateOutlet from '../../features/Auth/components/PrivateOutlet/PrivateOutlet';
import LoginPage from '../../features/Auth/pages/LoginPage';
import RolesPage from '../../features/Roles/pages/RolesPage';
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
        path: 'roles',
        element: <RolesPage title={'Rôles'} />,
        meta: {
          title: 'Rôles',
          iconElement: <ManageAccountsIcon />
        }
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
