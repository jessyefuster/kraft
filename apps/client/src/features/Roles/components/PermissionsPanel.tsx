import type { PermissionDTO } from '@internal/types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import AddPermissionsButton from './AddPermissionsButton';
import PermissionTable from './PermissionTable';
import StateIllustration from '../../../components/ui/StateIllustration';

interface Props {
  permissions?: PermissionDTO[];
}

// eslint-disable-next-line arrow-body-style
const PermissionsPanel = ({ permissions }: Props) => {
  return permissions?.length
    ? <>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography>Ajouter des permissions à ce rôle. Les utilisateurs qui possèdent ce rôle bénéficieront immédiatement des permissions présentes ci-dessous.</Typography>
          <AddPermissionsButton sx={{ marginLeft: 2, flexShrink: 0 }} />
        </Box>
        <Box sx={{ flex: 1, position: 'relative', marginTop: 4 }} >
          <PermissionTable permissions={permissions} containerProps={{ height: '100%', position: 'absolute' }} />
        </Box>
      </>
    : (
      <StateIllustration
        state="empty"
        title="C'est vide !"
        message="Aucune permission associée au rôle"
      >
        <AddPermissionsButton />
      </StateIllustration>
    )
  ;
};

export default PermissionsPanel;
