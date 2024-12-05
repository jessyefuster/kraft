import type { UserDTO } from '@internal/types';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCallback, useState } from 'react';

import Dialog from '../../../components/ui/Dialog';
import CreateUserForm from './CreateUserForm';

interface Props {
  onCreateUser?: (user: UserDTO) => void;
}

const CreateUserButton = ({ onCreateUser }: Props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const onClick = useCallback(() => setIsFormOpen(true), []);
  const onDialogClose = useCallback(() => setIsFormOpen(false), []);
  const onSubmitSuccess = useCallback((user: UserDTO) => {
    onDialogClose();
    onCreateUser && onCreateUser(user);
  }, [onCreateUser, onDialogClose]);

  return (
    <>
      <Button
        onClick={onClick}
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
      >
        Nouvel utilisateur
      </Button>
      <Dialog
        isOpen={isFormOpen}
        onClose={onDialogClose}
        title="Nouvel utilisateur"
        confirmText="Valider"
        fullScreen={fullScreen}
        fullWidth={true}
        maxWidth={'xs'}
        actions={null}
      >
        <CreateUserForm onBackClick={onDialogClose} onSubmitSuccess={onSubmitSuccess} />
      </Dialog>
    </>
  );
};

export default CreateUserButton;
