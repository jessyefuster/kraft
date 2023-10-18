import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { useCreateRoleMutation } from '../../../app/api';
import yup, { getRequiredFields } from '../../../lib/yup';

export type CreateRoleFormData = yup.InferType<typeof validationSchema>;

const validationSchema = yup.object({
  name: yup.string().required('Saisissez le nom du rôle'),
  description: yup.string(),
});

interface FormOptions {
  defaultValues?: CreateRoleFormData;
}

export const useCreateRoleForm = (options: FormOptions = {}) => {
  const { defaultValues } = options;
  const requiredFields = getRequiredFields(validationSchema);
  const [createRole, { isLoading }] = useCreateRoleMutation();

  const submitHandler = (formValue: CreateRoleFormData) => {
    const { name, description } = formValue;

    return createRole({ name, description }).unwrap();
  };

  return {
    form: useForm({ defaultValues, resolver: yupResolver(validationSchema) }),
    requiredFields,
    isLoading,
    submitHandler
  };
};
