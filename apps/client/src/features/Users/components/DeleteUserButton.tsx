import type { UserDTO } from '@internal/types';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCallback, useMemo } from 'react';

import { useDeleteUserMutation } from '../../../app/api';
import type { Props as ButtonWithConfirmDialogProps } from '../../../components/ui/ButtonWithConfirmDialog';
import ButtonWithConfirmDialog from '../../../components/ui/ButtonWithConfirmDialog';

interface Props {
  id: UserDTO['id'];
}

const DeleteUserButton = ({ id }: Props) => {
  const [deleteUser] = useDeleteUserMutation();
  const handleConfirm = useCallback(() => deleteUser(id), [id, deleteUser]);
  const dialogOptions = useMemo<ButtonWithConfirmDialogProps['dialogOptions']>(() => ({
    title: "Supprimer l'utilisateur ?",
    description: "En supprimant l'utilisateur, le compte et ses actions associées seront définitivement perdues.",
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

export default DeleteUserButton;
