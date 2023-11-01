import type { RoleDTO } from '@internal/types';
import EditIcon from '@mui/icons-material/Edit';
import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import { useCallback, useMemo, useState } from 'react';

import { useAddRolePermissionsMutation, useGetPermissionsQuery } from '../../../app/api';
import Drawer from '../../../components/ui/Drawer';
import Table from '../../../components/ui/Table';
import type { ColumnsDisplay } from '../hooks/usePermissionTableData';
import { usePermissionTableData } from '../hooks/usePermissionTableData';

const columnsDisplay: ColumnsDisplay = {
  code: true,
  description: true,
  group: false,
  actions: false
};

interface Props extends ButtonProps {
  roleId: RoleDTO['id'];
  rolePermissions?: RoleDTO['permissions'];
  label?: string;
}

const AddPermissionsButton = ({ roleId, rolePermissions = [], label = 'Ajouter des permissions', ...rest }: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [addRolePermissions] = useAddRolePermissionsMutation();
  const { data: permissions = [] } = useGetPermissionsQuery();
  const notInRolePermissions = useMemo(() =>
    permissions.filter(permission => !rolePermissions.find(rolePermission => rolePermission.id === permission.id))
  , [permissions, rolePermissions]);
  const tableData = usePermissionTableData(roleId, notInRolePermissions, columnsDisplay);
  const onClick = useCallback(() => setIsFormOpen(true), []);
  const onDrawerClose = useCallback(() => setIsFormOpen(false), []);
  const onSelectionChange = (ids: string[]) => setSelectedPermissions(ids);

  const handleConfirm = useCallback(() => {
    void addRolePermissions({
      id: roleId,
      body: {
        permissionsIds: selectedPermissions
      }
    });
  }
  , [roleId, selectedPermissions, addRolePermissions]);

  return (
    <>
      <Button
        {...rest}
        variant="contained"
        startIcon={useMemo(() => <EditIcon />, [])}
        onClick={onClick}
      >
        {label}
      </Button>
      <Drawer
        title={label}
        isOpen={isFormOpen}
        onClose={onDrawerClose}
        onConfirm={handleConfirm}
        size="large"
      >
        <Table
          label="Permissions à modifier"
          showPagination={false}
          selectable
          onSelectionChange={onSelectionChange}
          {...tableData}
        />
      </Drawer>
    </>
  );
};

export default AddPermissionsButton;
