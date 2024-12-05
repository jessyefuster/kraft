
import type { UserDTO } from '@internal/types';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import Form from '../../../components/forms/Form';
import TextInput from '../../../components/forms/TextInput';
import { useCreateUserForm } from '../hooks/useCreateUserForm';

const ActionsContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'end',
  marginTop: '20px'
});

interface Props {
  onBackClick: () => void;
  onSubmitSuccess: (user: UserDTO) => void;
}

const CreateUserForm = ({ onBackClick, onSubmitSuccess }: Props) => {
  const { form, requiredFields, isLoading, submitHandler } = useCreateUserForm();

  return (
    <Form form={form} onSubmit={submitHandler} onSubmitSuccess={onSubmitSuccess}>
      <TextInput
        label="Nom d'utilisateur"
        name="username"
        control={form.control}
        required={requiredFields.username}
        sx={{ mt: 2 }}
      />
      <TextInput
        label="Mot de passe"
        name="password"
        control={form.control}
        required={requiredFields.password}
        sx={{ mt: 2 }}
      />
      <TextInput
        label="Adresse e-mail"
        name="email"
        control={form.control}
        required={requiredFields.email}
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
  
export default CreateUserForm;
