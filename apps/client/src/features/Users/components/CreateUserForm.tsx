
import type { UserDTO } from '@internal/types';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useMemo } from 'react';

import { useGetRolesQuery } from '../../../app/api';
import Form from '../../../components/forms/Form';
import type { SelectItem } from '../../../components/forms/Select';
import Select from '../../../components/forms/Select';
import TextInput from '../../../components/forms/TextInput';
import { useHasPermissions } from '../../Permissions/hooks/useHasPermissions';
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
  const showRole = useHasPermissions(['read:roles']);
  const { form, requiredFields, isLoading, submitHandler } = useCreateUserForm();
  const { data: roles = [] } = useGetRolesQuery();
  const rolesItems = useMemo(() =>
    roles.map<SelectItem>(role => ({ value: role.id, label: role.name }))
  , [roles]);

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
      {showRole && !!roles.length &&
        <Select
          label="Rôle"
          name="roleId"
          items={rolesItems}
          control={form.control}
          required={requiredFields.roleId}
          containerProps={{ sx: { mt: 2 } }}
        />
      }
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
