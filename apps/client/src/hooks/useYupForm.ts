import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import type { DefaultValues, FieldValues, Resolver } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { ObjectSchema } from 'yup';

import { getRequiredFields } from '../lib/yup';

interface Props<T extends FieldValues> {
  validationSchema: ObjectSchema<T>;
  defaultValues?: DefaultValues<T>;
}

export const useYupForm = <T extends FieldValues>({ validationSchema, defaultValues }: Props<T>) => {
  const resolver = useMemo(() => yupResolver(validationSchema) as unknown as Resolver<T>, [validationSchema]);
  const requiredFields = useMemo(() => getRequiredFields(validationSchema), [validationSchema]);
  const formConfig = useMemo(() => ({ defaultValues, resolver }), [defaultValues, resolver]);
  const form = useForm(formConfig);

  return useMemo(() => ({
    form,
    requiredFields
  }), [form, requiredFields]);
};
