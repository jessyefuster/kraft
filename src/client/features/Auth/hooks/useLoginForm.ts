import { useForm } from 'react-hook-form';

import { LoginFormData } from '../models/login';

export const useLoginForm = () => {
  return useForm<LoginFormData>();
};
