import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';

import { useDeleteUserMutation } from '../../../app/api';
import Table, { Column } from '../../../components/ui/Table';
import { UserDTO } from '../../../lib/api/models/users';

const formatTable = (users: UserDTO[], onDeleteClick: (id: UserDTO['id']) => void) => {
  const columns: Column[] = [
    { title: undefined, 'aria-label': 'Avatar' },
    { title: 'Nom d\'utilisateur' },
    { title: 'E-mail' },
    { title: 'Date de création', align: 'right' },
    { title: 'Actions', align: 'right' }
  ];
  const items = users.map(user => ({
    key: user.id,
    data: {
      avatar: <Avatar>{user.username[0].toUpperCase()}</Avatar>,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      actions: (
        <DeleteUserButton onDeleteConfirm={() => onDeleteClick(user.id)} />
      )
    }
  }));

  return {
    columns,
    items
  };
}

interface Props {
  users: UserDTO[];
}

const DeleteUserButton = ({ onDeleteConfirm }: { onDeleteConfirm: () => void }) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = (confirm?: boolean) => {
    setDialogOpen(false);

    if (confirm) {
      onDeleteConfirm();
    }
  };

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <IconButton aria-label="Delete user" onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={dialogOpen}
        onClose={() => handleDialogClose()}
        aria-labelledby='delete-user-alert-dialog-title'
        aria-describedby='delete-user-alert-dialog-description'
      >
        <DialogTitle id="delete-user-alert-dialog-title">{"Supprimer l'utilisateur ?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            En supprimant l'utilisateur, le compte et ses actions associées seront définitivement perdues.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose()}>Retour</Button>
          <Button
            onClick={() => handleDialogClose(true)}
            color='error'
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const UserTable = ({ users }: Props) => {
  const [deleteUser] = useDeleteUserMutation();

  const onDeleteClick = (id: UserDTO['id']) => {
    deleteUser(id);
  };

  return (
    <Table
      label='Liste des utilisateurs'
      {...formatTable(users, (id) => onDeleteClick(id))}
    />
  );
};

export default UserTable;
