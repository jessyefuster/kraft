import type { RoleDTO } from '@internal/types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import StateIllustration from '../../../components/ui/StateIllustration';
import Table from '../../../components/ui/Table';
import { usePermissionTableData } from '../hooks/usePermissionTableData';
import AddPermissionsButton from './AddPermissionsButton';

interface Props {
  roleId: RoleDTO['id'];
  permissions?: RoleDTO['permissions'];
}

const PermissionsPanel = ({ roleId, permissions }: Props) => {
  const tableData = usePermissionTableData(roleId, permissions || []);

  return permissions?.length
    ? <>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography>Ajouter ou supprimer des permissions au rôle. Les utilisateurs qui possèdent ce rôle bénéficieront immédiatement des modifications.</Typography>
          <AddPermissionsButton roleId={roleId} rolePermissions={permissions} sx={{ marginLeft: 2, flexShrink: 0 }} />
        </Box>
        <Box sx={{ flex: 1, position: 'relative', marginTop: 4 }}>
          <Table
            label="Liste des permissions"
            containerProps={{ height: '100%', position: 'absolute' }}
            {...tableData}
          />
        </Box>
      </>
    : (
      <StateIllustration
        state="empty"
        title="C'est vide !"
        message="Aucune permission associée au rôle"
      >
        <AddPermissionsButton roleId={roleId} rolePermissions={permissions} />
      </StateIllustration>
    )
  ;
};

export default PermissionsPanel;
