import type { PermissionDTO, RoleDTO } from '@internal/types';
import { useMemo } from 'react';

import type { Column, Item } from '../../../components/ui/Table';
import DeletePermissionButton from '../components/DeletePermissionsButton';

type PermissionColumn = 'code' | 'description' | 'group' | 'actions';

type PermissionColumns<T> = {
  [key in PermissionColumn]: T;
};

export type ColumnsDisplay = Partial<PermissionColumns<boolean>>;

export const usePermissionTableData = (roleId: RoleDTO['id'], permissions: PermissionDTO[], columnsDisplay?: ColumnsDisplay) => {
  const permissionsIds = useMemo(() => permissions.map(p => p.id), [permissions]);
  const data = useMemo(() => {
    const columns: Column<PermissionColumn>[] = [
      { id: 'code', title: 'Code', hidden: columnsDisplay?.code === false },
      { id: 'description', title: 'Description', hidden: columnsDisplay?.description === false },
      { id: 'group', title: 'API', hidden: columnsDisplay?.group === false },
      { id: 'actions', title: 'Actions', align: 'right', hidden: columnsDisplay?.actions === false }
    ];
    const items = permissions.map<Item<PermissionColumns<React.ReactNode>>>(permission => ({
      id: permission.id,
      primaryColumn: 'code',
      data: {
        code: <code>{permission.code}</code>,
        description: permission.description,
        group: <code>{permission.group?.code}</code>,
        actions: <DeletePermissionButton
          roleId={roleId}
          permissionsIds={permissionsIds}
          permissionToRemoveId={permission.id}
        />,
      }
    }));
  
    return {
      columns,
      items
    };
  }, [columnsDisplay, permissions, roleId, permissionsIds]);

  return data;
};
