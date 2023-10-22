import { useCallback, useMemo } from 'react';

import { useCreateRoleMutation } from '../../../app/api';
import { useYupForm } from '../../../hooks/useYupForm';
import yup from '../../../lib/yup';

const validationSchema = yup.object({
  name: yup.string().required('Saisissez le nom du rôle'),
  description: yup.string(),
});

export type CreateRoleFormData = yup.InferType<typeof validationSchema>;

interface FormOptions {
  defaultValues?: CreateRoleFormData;
}

export const useCreateRoleForm = ({ defaultValues }: FormOptions = {}) => {
  const [createRole, { isLoading }] = useCreateRoleMutation();
  const formConfig = useMemo(() => ({ validationSchema, defaultValues }), [defaultValues]);
  const { form, requiredFields } = useYupForm<CreateRoleFormData>(formConfig);

  const submitHandler = useCallback((formValue: CreateRoleFormData) => {
    const { name, description } = formValue;

    return createRole({ name, description }).unwrap();
  }, [createRole]);

  return useMemo(() => ({
    form,
    requiredFields,
    isLoading,
    submitHandler
  }), [form, isLoading, requiredFields, submitHandler]);
};
