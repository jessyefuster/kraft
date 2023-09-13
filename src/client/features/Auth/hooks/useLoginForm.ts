import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

export type LoginFormData = yup.InferType<typeof validationSchema>;

const validationSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});

export const useLoginForm = () => {
  return useForm({ resolver: yupResolver(validationSchema) });
};
