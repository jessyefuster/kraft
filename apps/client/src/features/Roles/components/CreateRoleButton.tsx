import type { RoleDTO } from '@internal/types';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCallback, useState } from 'react';

import Dialog from '../../../components/ui/Dialog';
import CreateRoleForm from './CreateRoleForm';

interface Props {
  onCreateRole?: (role: RoleDTO) => void;
}

const CreateRoleButton = ({ onCreateRole }: Props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const onClick = useCallback(() => setIsFormOpen(true), []);
  const onDialogClose = useCallback(() => setIsFormOpen(false), []);
  const onSubmitSuccess = useCallback((role: RoleDTO) => {
    onDialogClose();
    onCreateRole && onCreateRole(role);
  }, [onCreateRole, onDialogClose]);

  return (
    <>
      <Button
        onClick={onClick}
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
      >
        Nouveau rôle
      </Button>
      <Dialog
        isOpen={isFormOpen}
        onClose={onDialogClose}
        title="Nouveau rôle"
        confirmText="Valider"
        fullScreen={fullScreen}
        fullWidth={true}
        maxWidth={'xs'}
        actions={null}
      >
        <CreateRoleForm onBackClick={onDialogClose} onSubmitSuccess={onSubmitSuccess} />
      </Dialog>
    </>
  );
};

export default CreateRoleButton;
