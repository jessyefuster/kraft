import { useCallback, useMemo } from 'react';

import { useLogInMutation } from '../../../app/api';
import { useYupForm } from '../../../hooks/useYupForm';
import yup from '../../../lib/yup';

export type LoginFormData = yup.InferType<typeof validationSchema>;

const validationSchema = yup.object({
  username: yup.string().required("Saisissez votre nom d'utilisateur"),
  password: yup.string().required('Saisissez votre mot de passe'),
});

interface FormOptions {
  defaultValues?: LoginFormData;
}

export const useLoginForm = ({ defaultValues }: FormOptions = {}) => {
  const [logIn, { isLoading }] = useLogInMutation();
  const formConfig = useMemo(() => ({ validationSchema, defaultValues }), [defaultValues]);
  const { form, requiredFields } = useYupForm<LoginFormData>(formConfig);

  const submitHandler = useCallback((formValue: LoginFormData) => {
    const { username, password } = formValue;

    return logIn({ login: username, password }).unwrap();
  }, [logIn]);

  return useMemo(() => ({
    form,
    requiredFields,
    isLoading,
    submitHandler
  }), [form, isLoading, requiredFields, submitHandler]);
};
