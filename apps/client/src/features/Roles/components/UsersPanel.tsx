import { useMemo } from 'react';

import type { RoleDTO } from '@internal/types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import StateIllustration from '../../../components/ui/StateIllustration';
import Table from '../../../components/ui/Table';
import type { ColumnsDisplay } from '../../Users/hooks/useUserTableData';
import { useUserTableData } from '../../Users/hooks/useUserTableData';
import AddUsersButton from './AddUsersButton';
import DeleteUsersButton from './DeleteUsersButton';
import { useHasPermissions } from '../../Permissions/hooks/useHasPermissions';

const columnsDisplay: ColumnsDisplay = {
  role: false,
  createdAt: false
};

interface Props {
  roleId: RoleDTO['id'];
  users?: RoleDTO['users'];
}

const UsersPanel = ({ roleId, users }: Props) => {
  const showEditAction = useHasPermissions(['update:users']);
  const tableData = useUserTableData(users || [], useMemo(() => ({
    columnsDisplay: { ...columnsDisplay, actions: showEditAction },
    renderActions: ({ userId }) => <DeleteUsersButton roleId={roleId} usersIds={[userId]} />
  }), [roleId, showEditAction]));

  return users?.length
    ? <>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography>Liste des utilisateurs possédant ce rôle.</Typography>
          {showEditAction &&
            <AddUsersButton roleId={roleId} roleUsers={users} sx={{ marginLeft: 2, flexShrink: 0 }} />
          }
        </Box>
        <Box sx={{ flex: 1, position: 'relative', marginTop: 4 }}>
          <Table
            label="Liste des utilisateurs"
            containerProps={{ height: '100%', position: 'absolute' }}
            {...tableData}
          />
        </Box>
      </>
    : (
      <StateIllustration
        state="empty"
        title="C'est vide !"
        message="Aucun utilisateur ne possède ce rôle"
      >
        {showEditAction && <AddUsersButton roleId={roleId} roleUsers={users} />}
      </StateIllustration>
    )
  ;
};

export default UsersPanel;
