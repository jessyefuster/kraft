import type { RoleDTO } from '@internal/types';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCallback, useMemo } from 'react';

import { useDeleteRoleMutation } from '../../../app/api';
import type { Props as ButtonWithConfirmDialogProps } from '../../../components/ui/ButtonWithConfirmDialog';
import ButtonWithConfirmDialog from '../../../components/ui/ButtonWithConfirmDialog';

interface Props {
  id: RoleDTO['id'];
}

const DeleteRoleButton = ({ id }: Props) => {
  const [deleteRole] = useDeleteRoleMutation();
  const handleConfirm = useCallback(() => deleteRole(id), [id, deleteRole]);
  const dialogOptions = useMemo<ButtonWithConfirmDialogProps['dialogOptions']>(() => ({
    title: 'Supprimer le rôle ?',
    description: "La suppression ne sera effectuée que si aucun utilisateur n'a ce rôle d'attribué.",
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

export default DeleteRoleButton;
