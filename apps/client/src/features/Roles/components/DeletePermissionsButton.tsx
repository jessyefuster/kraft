import type { PermissionDTO, RoleDTO } from '@internal/types';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCallback, useMemo } from 'react';

import { useUpdateRolePermissionsMutation } from '../../../app/api';
import type { Props as ButtonWithConfirmDialogProps } from '../../../components/ui/ButtonWithConfirmDialog';
import ButtonWithConfirmDialog from '../../../components/ui/ButtonWithConfirmDialog';

interface Props {
  roleId: RoleDTO['id'];
  permissionsIds: PermissionDTO['id'][];
  permissionToRemoveId: PermissionDTO['id'];
}

const DeletePermissionButton = ({ roleId, permissionsIds, permissionToRemoveId }: Props) => {
  const [updateRolePermissions] = useUpdateRolePermissionsMutation();
  const handleConfirm = useCallback(() => updateRolePermissions({
    id: roleId,
    body: {
      permissionsIds: permissionsIds.filter(id => id !== permissionToRemoveId)
    }
  }), [permissionToRemoveId, permissionsIds, roleId, updateRolePermissions]);
  const dialogOptions = useMemo<ButtonWithConfirmDialogProps['dialogOptions']>(() => ({
    title: 'Supprimer la permission ?',
    description: 'La modification sera effective immédiatement',
    confirmText: 'Supprimer',
    confirmType: 'destructive'
  }), []);

  return (
    <ButtonWithConfirmDialog
      icon={useMemo(() => <DeleteIcon />, [])}
      dialogOptions={dialogOptions}
      onConfirm={handleConfirm}
    />
  );
};

export default DeletePermissionButton;
