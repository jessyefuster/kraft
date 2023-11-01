
import type { PermissionDTO } from '@internal/types';
import { useMemo } from 'react';

import type { Column, TableProps } from '../../../components/ui/Table';
import Table from '../../../components/ui/Table';

type PermissionColumn = 'code' | 'description' | 'group' | 'actions';

type PermissionColumns<T> = {
  [key in PermissionColumn]: T;
};

export interface Props {
  permissions: PermissionDTO[];
  columnsDisplay?: PermissionColumns<boolean>;
  containerProps?: TableProps['containerProps'];
}

const PermissionTable = ({
  permissions,
  containerProps,
  columnsDisplay = {
    code: true,
    description: true,
    group: true,
    actions: true,
  }
}: Props) => {
  const table = useMemo(() => {
    const columns: Column<PermissionColumn>[] = [
      { key: 'code', title: 'Code', hidden: !columnsDisplay.code },
      { key: 'description', title: 'Description', hidden: !columnsDisplay.description },
      { key: 'group', title: 'API', hidden: !columnsDisplay.group },
      { key: 'actions', title: 'Actions', align: 'right', hidden: !columnsDisplay.actions }
    ];
    const items = permissions.map(permission => ({
      key: permission.id,
      data: {
        code: <code>{permission.code}</code>,
        description: permission.description,
        group: <code>{permission.group?.code}</code>,
        actions: undefined
      } as PermissionColumns<React.ReactNode>
    }));
  
    return {
      columns,
      items
    };
  }, [permissions, columnsDisplay]);

  return (
    <Table
      containerProps={containerProps}
      label="Liste des permissions"
      {...table}
    />
  );
};

export default PermissionTable;
