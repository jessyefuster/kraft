
import type { PermissionDTO } from '@internal/types';
import { useMemo } from 'react';

import type { Column, TableProps } from '../../../components/ui/Table';
import Table from '../../../components/ui/Table';

interface Props {
  permissions: PermissionDTO[];
  containerProps?: TableProps['containerProps'];
}

const PermissionTable = ({ permissions, containerProps }: Props) => {
  const table = useMemo(() => {
    const columns: Column[] = [
      { title: 'Code' },
      { title: 'Description' },
      { title: 'API' },
      { title: 'Actions', align: 'right' }
    ];
    const items = permissions.map(permission => ({
      key: permission.id,
      data: {
        code: <code>{permission.code}</code>,
        description: permission.description,
        group: <code>{permission.group?.code}</code>,
        actions: undefined
      }
    }));
  
    return {
      columns,
      items
    };
  }, [permissions]);

  return (
    <Table
      containerProps={containerProps}
      label="Liste des permissions"
      {...table}
    />
  );
};

export default PermissionTable;
