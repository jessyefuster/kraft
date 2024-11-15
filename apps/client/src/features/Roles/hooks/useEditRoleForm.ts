import { useCallback, useMemo } from 'react';
import type { RoleDTO } from '@internal/types';

import { useEditRoleMutation } from '../../../app/api';
import { useYupForm } from '../../../hooks/useYupForm';
import yup from '../../../lib/yup';

const validationSchema = yup.object({
  name: yup.string().required('Le nom du rôle est requis'),
  description: yup.string(),
});

export type EditRoleFormData = yup.InferType<typeof validationSchema>;

interface FormOptions {
  defaultValues?: EditRoleFormData;
}

export const useEditRoleForm = (id: RoleDTO['id'], { defaultValues }: FormOptions = {}) => {
  const [editRole, { isLoading }] = useEditRoleMutation();
  const formConfig = useMemo(() => ({ validationSchema, defaultValues }), [defaultValues]);
  const { form, requiredFields } = useYupForm<EditRoleFormData>(formConfig);

  const submitHandler = useCallback((formValue: EditRoleFormData) => {
    const { name, description } = formValue;

    return editRole({ id, body: { name, description } }).unwrap();
  }, [id, editRole]);

  return useMemo(() => ({
    form,
    requiredFields,
    isLoading,
    submitHandler
  }), [form, isLoading, requiredFields, submitHandler]);
};
