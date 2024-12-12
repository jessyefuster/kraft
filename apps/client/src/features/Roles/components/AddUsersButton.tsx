import type { RoleDTO } from '@internal/types';
import EditIcon from '@mui/icons-material/Edit';
import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import { useCallback, useMemo, useState } from 'react';

import { useAddRoleUsersMutation, useGetUsersQuery } from '../../../app/api';
import Drawer from '../../../components/ui/Drawer';
import Table from '../../../components/ui/Table';
import type { ColumnsDisplay } from '../../Users/hooks/useUserTableData';
import { useUserTableData } from '../../Users/hooks/useUserTableData';

const columnsDisplay: ColumnsDisplay = {
  email: false,
  createdAt: false,
  actions: false,
};

interface Props extends ButtonProps {
  roleId: RoleDTO['id'];
  roleUsers?: RoleDTO['users'];
  label?: string;
}

const AddUsersButton = ({ roleId, roleUsers = [], label = 'Assigner le rôle', ...rest }: Props) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [addRoleUsers] = useAddRoleUsersMutation();
  const { data: users = [] } = useGetUsersQuery();
  const notInRoleUsers = useMemo(() =>
    users.filter(user => !roleUsers.find(roleUser => roleUser.id === user.id))
  , [users, roleUsers]);
  const tableData = useUserTableData(notInRoleUsers, { columnsDisplay });
  const onClick = useCallback(() => setIsFormOpen(true), []);
  const onDrawerClose = useCallback(() => setIsFormOpen(false), []);
  const onSelectionChange = (ids: string[]) => setSelectedUsers(ids);

  const handleConfirm = useCallback(() => {
    void addRoleUsers({
      id: roleId,
      body: {
        usersIds: selectedUsers
      }
    });
  }
  , [roleId, selectedUsers, addRoleUsers]);

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
          label="Utilisateurs à assigner"
          showPagination={false}
          selectable
          onSelectionChange={onSelectionChange}
          {...tableData}
        />
      </Drawer>
    </>
  );
};

export default AddUsersButton;
