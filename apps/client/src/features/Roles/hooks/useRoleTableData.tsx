import { useCallback, useMemo } from 'react';

import type { RoleDTO } from '@internal/types';
import Tooltip from '@mui/material/Tooltip';

import AutoColoredChip from '../../../components/ui/AutoColoredChip';
import type { Column, Item } from '../../../components/ui/Table';
import { truncateListWithSummary } from '../../../utils/truncateListWithSummary';
import DeleteRoleButton from '../components/DeleteRoleButton';
import ViewDetailButton from '../components/ViewDetailButton';

type RoleColumn = 'name' | 'description' | 'users' | 'permissions' | 'actions';

type RoleColumns<T> = {
  [key in RoleColumn]: T;
};

export type ColumnsDisplay = RoleColumns<boolean>;

export const useRoleTableData = (roles: RoleDTO[]) => {
  const getPermissionsLabel = useCallback((role: RoleDTO) => {
    const permissionCodes = role.permissions?.map(permission => permission.code) || [];

    return truncateListWithSummary(permissionCodes, 6) || 'Aucune permission';
  }, []);

  const getUsersLabel = useCallback((role: RoleDTO) => {
    const usernames = role.users?.map(user => user.username) || [];

    return truncateListWithSummary(usernames, 6) || 'Aucun utilisateur';
  }, []);

  const data = useMemo(() => {
    const columns: Column<RoleColumn>[] = [
      { id: 'name', title: 'Nom du rôle' },
      { id: 'description', title: 'Description' },
      { id: 'users', title: 'Utilisateurs', align: 'right' },
      { id: 'permissions', title: 'Permissions', align: 'right' },
      { id: 'actions', title: 'Actions', align: 'right' }
    ];
    const items = roles.map<Item<RoleColumns<React.ReactNode>>>(role => ({
      id: role.id,
      primaryColumn: 'name',
      data: {
        name: <AutoColoredChip labelStr={role.name} label={role.name} variant="outlined" />,
        description: role.description,
        users: (
          <Tooltip title={getUsersLabel(role)} placement="left">
            <span>{role.usersCount}</span>
          </Tooltip>
        ),
        permissions: (
          <Tooltip title={getPermissionsLabel(role)} placement="left">
            <span>{role.permissionsCount}</span>
          </Tooltip>
        ),
        actions:
          <>
            <DeleteRoleButton id={role.id} />
            <ViewDetailButton id={role.id} />
          </>
      }
    }));
  
    return {
      columns,
      items
    };
  }, [roles, getPermissionsLabel, getUsersLabel]);

  return data;
};
