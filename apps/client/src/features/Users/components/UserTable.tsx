import type { UserDTO } from '@internal/types';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import { useCallback, useMemo } from 'react';

import { useDeleteUserMutation } from '../../../app/api';
import AutoColoredChip from '../../../components/ui/AutoColoredChip';
import type { Props as ButtonWithConfirmDialogProps } from '../../../components/ui/ButtonWithConfirmDialog';
import ButtonWithConfirmDialog from '../../../components/ui/ButtonWithConfirmDialog';
import type { Column, TableProps } from '../../../components/ui/Table';
import Table from '../../../components/ui/Table';

type UserColumn = 'avatar' | 'username' | 'email' | 'role' | 'createdAt' | 'actions';

type UserColumns<T> = {
  [key in UserColumn]: T;
};

interface Props {
  users: UserDTO[];
  containerProps?: TableProps['containerProps'];
}

const DeleteUserButton = ({ onDeleteConfirm }: { onDeleteConfirm: () => void }) => {
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
      onConfirm={onDeleteConfirm}
    />
  );
};

const UserTable = ({ users, containerProps }: Props) => {
  const [deleteUser] = useDeleteUserMutation();
  const onDeleteUserConfirm = useCallback((userId: string) => deleteUser(userId), [deleteUser]);

  const table = useMemo(() => {
    const columns: Column<UserColumn>[] = [
      { key: 'avatar', title: undefined, 'aria-label': 'Avatar' },
      { key: 'username', title: 'Nom d\'utilisateur' },
      { key: 'email', title: 'E-mail' },
      { key: 'role', title: 'Rôle' },
      { key: 'createdAt', title: 'Date de création', align: 'right' },
      { key: 'actions', title: 'Actions', align: 'right' }
    ];
    const items = users.map(user => ({
      key: user.id,
      data: {
        avatar: <Avatar>{user.username[0].toUpperCase()}</Avatar>,
        username: user.username,
        email: user.email,
        role: user.role && <AutoColoredChip label={user.role.name} labelStr={user.role.name} variant="outlined" />,
        createdAt: user.createdAt,
        // eslint-disable-next-line @arthurgeron/react-usememo/require-usememo
        actions: <DeleteUserButton onDeleteConfirm={() => onDeleteUserConfirm(user.id)} />
      } as UserColumns<React.ReactNode>
    }));
  
    return {
      columns,
      items
    };
  }, [users, onDeleteUserConfirm]);

  return (
    <Table
      containerProps={containerProps}
      label="Liste des utilisateurs"
      {...table}
    />
  );
};

export default UserTable;
