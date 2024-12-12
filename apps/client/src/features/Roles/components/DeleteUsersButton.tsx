import type { RoleDTO, UserDTO } from '@internal/types';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCallback, useMemo } from 'react';

import { useDeleteRoleUsersMutation } from '../../../app/api';
import type { Props as ButtonWithConfirmDialogProps } from '../../../components/ui/ButtonWithConfirmDialog';
import ButtonWithConfirmDialog from '../../../components/ui/ButtonWithConfirmDialog';

interface Props {
  roleId: RoleDTO['id'];
  usersIds: UserDTO['id'][];
}

const DeleteUsersButton = ({ roleId, usersIds }: Props) => {
  const [deleteRoleUsers] = useDeleteRoleUsersMutation();
  const handleConfirm = useCallback(() => deleteRoleUsers({
    id: roleId,
    body: {
      usersIds
    }
  }), [roleId, usersIds, deleteRoleUsers]);
  const dialogOptions = useMemo<ButtonWithConfirmDialogProps['dialogOptions']>(() => ({
    title: 'Supprimer le rôle de l\'utilisateur ?',
    description: 'L\'utilisateur se retrouvera sans rôle. Vous devrez lui en réassigner un ultérieurement.',
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

export default DeleteUsersButton;
