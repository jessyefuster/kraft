
import type { RoleDTO } from '@internal/types';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import Form from '../../../components/forms/Form';
import TextInput from '../../../components/forms/TextInput';
import { useCreateRoleForm } from '../hooks/useCreateRoleForm';

const ActionsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'end',
  marginTop: '20px'
});

interface Props {
  onBackClick: () => void;
  onSubmitSuccess: (role: RoleDTO) => void;
}

const CreateRoleForm = ({ onBackClick, onSubmitSuccess }: Props) => {
  const { form, requiredFields, isLoading, submitHandler } = useCreateRoleForm();

  return (
    <Form form={form} onSubmit={submitHandler} onSubmitSuccess={onSubmitSuccess}>
      <TextInput
        label="Nom du rôle"
        name="name"
        control={form.control}
        required={requiredFields.name}
        sx={{ mt: 2 }}
      />
      <TextInput
        label="Description"
        name="description"
        control={form.control}
        required={requiredFields.description}
        sx={{ mt: 2 }}
      />
      <ActionsContainer>
        <Button onClick={onBackClick}>Retour</Button>
        <LoadingButton
          loading={isLoading}
          type="submit"
          variant="contained"
          sx={{ ml: 2 }}
        >
          Valider
        </LoadingButton>
      </ActionsContainer>
    </Form>
  );
};
  
export default CreateRoleForm;
