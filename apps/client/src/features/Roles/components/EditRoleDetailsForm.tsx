
import type { RoleDTO } from '@internal/types';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import Form from '../../../components/forms/Form';
import TextInput from '../../../components/forms/TextInput';
import { useEditRoleForm } from '../hooks/useEditRoleForm';

const ActionsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'end',
  marginTop: '20px'
});

interface Props {
  role?: RoleDTO;
  onSubmitSuccess?: (role: RoleDTO) => void;
}

const EditRoleDetailsForm = ({ role, onSubmitSuccess }: Props) => {
  const { form, requiredFields, isLoading, submitHandler } = useEditRoleForm(role?.id || '', { defaultValues: role });

  return (
    <Form form={form} onSubmit={submitHandler} onSubmitSuccess={onSubmitSuccess}>
      <InputLabel>
        <Typography variant="subtitle1">Nom</Typography>
      </InputLabel>
      <TextInput
        name="name"
        control={form.control}
        required={requiredFields.name}
        sx={{ mt: 1 }}
      />
      <InputLabel sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Description</Typography>
      </InputLabel>
      <TextInput
        placeholder="Description de ce rôle..."
        name="description"
        control={form.control}
        required={requiredFields.description}
        sx={{ mt: 1 }}
      />
      <ActionsContainer>
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
  
export default EditRoleDetailsForm;
