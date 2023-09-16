import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import yup, { getRequiredFields } from '../../../lib/yup';

export type LoginFormData = yup.InferType<typeof validationSchema>;

const validationSchema = yup.object({
  username: yup.string().required("Saisissez votre nom d'utilisateur"),
  password: yup.string().required("Saisissez votre mot de passe"),
});

interface FormOptions {
  defaultValues?: LoginFormData;
}

export const useLoginForm = (options: FormOptions = {}) => {
  const { defaultValues } = options;
  const requiredFields = getRequiredFields(validationSchema);

  return {
    requiredFields,
    form: useForm({ defaultValues, resolver: yupResolver(validationSchema) })
  };
};
