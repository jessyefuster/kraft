import type { RoleDTO } from '@internal/types';
import { useMemo } from 'react';

import AutoColoredChip from '../../../components/ui/AutoColoredChip';
import type { Column, Item } from '../../../components/ui/Table';
import DeleteRoleButton from '../components/DeleteRoleButton';
import ViewDetailButton from '../components/ViewDetailButton';

type RoleColumn = 'name' | 'description' | 'permissions' | 'actions';

type RoleColumns<T> = {
  [key in RoleColumn]: T;
};

export type ColumnsDisplay = RoleColumns<boolean>;

export const useRoleTableData = (roles: RoleDTO[]) => {
  const data = useMemo(() => {
    const columns: Column<RoleColumn>[] = [
      { id: 'name', title: 'Nom du rôle' },
      { id: 'description', title: 'Description' },
      { id: 'permissions', title: 'Nombre de permissions', align: 'right' },
      { id: 'actions', title: 'Actions', align: 'right' }
    ];
    const items = roles.map<Item<RoleColumns<React.ReactNode>>>(role => ({
      id: role.id,
      primaryColumn: 'name',
      data: {
        name: <AutoColoredChip labelStr={role.name} label={role.name} variant="outlined" />,
        description: role.description,
        permissions: role.permissionsCount,
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
  }, [roles]);

  return data;
};
