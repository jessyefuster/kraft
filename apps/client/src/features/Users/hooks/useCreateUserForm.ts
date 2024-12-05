import { useCallback, useMemo } from 'react';

import { useCreateUserMutation } from '../../../app/api';
import { useYupForm } from '../../../hooks/useYupForm';
import yup from '../../../lib/yup';

const validationSchema = yup.object({
  username: yup.string().required('Saisissez un nom d\'utilisateur'),
  password: yup.string().required('Saisissez un mot de passe'),
  email: yup.string().email('Saisissez une adresse e-mail valide').required('Saisissez une adresse e-mail'),
  roleId: yup.string(),
});

export type CreateUserFormData = yup.InferType<typeof validationSchema>;

interface FormOptions {
  defaultValues?: CreateUserFormData;
}

export const useCreateUserForm = ({ defaultValues }: FormOptions = {}) => {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const formConfig = useMemo(() => ({ validationSchema, defaultValues }), [defaultValues]);
  const { form, requiredFields } = useYupForm<CreateUserFormData>(formConfig);

  const submitHandler = useCallback((formValue: CreateUserFormData) => {
    const { username, password, email, roleId } = formValue;

    return createUser({ username, password, email, roleId }).unwrap();
  }, [createUser]);

  return useMemo(() => ({
    form,
    requiredFields,
    isLoading,
    submitHandler
  }), [form, isLoading, requiredFields, submitHandler]);
};
