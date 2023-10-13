import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import yup, { getRequiredFields } from '../../../lib/yup';
import { useLogInMutation } from '../../../app/api';

export type LoginFormData = yup.InferType<typeof validationSchema>;

const validationSchema = yup.object({
  username: yup.string().required("Saisissez votre nom d'utilisateur"),
  password: yup.string().required('Saisissez votre mot de passe'),
});

interface FormOptions {
  defaultValues?: LoginFormData;
}

export const useLoginForm = (options: FormOptions = {}) => {
  const { defaultValues } = options;
  const requiredFields = getRequiredFields(validationSchema);
  const [logIn, { isLoading }] = useLogInMutation();

  const submitHandler = (formValue: LoginFormData) => {
    const { username, password } = formValue;

    return logIn({ login: username, password }).unwrap();
  };

  return {
    form: useForm({ defaultValues, resolver: yupResolver(validationSchema) }),
    requiredFields,
    isLoading,
    submitHandler
  };
};
