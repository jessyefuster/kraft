import { styled } from '@mui/material';
import type { PropsWithChildren } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

interface Props<TFieldValues extends FieldValues, U> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: (data: TFieldValues) => Promise<U>;
  onSubmitSuccess?: (data: U) => unknown;
  children: React.ReactNode[];
}

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 500
});

const Form = <T extends FieldValues, U>({ form, onSubmit, onSubmitSuccess, children }: PropsWithChildren<Props<T, U>>) => {

  const handleSubmit = form.handleSubmit((formValue) => 
    onSubmit(formValue)
      .then((data) => onSubmitSuccess && onSubmitSuccess(data))
      .catch((error) => console.warn(error))
  );

  return (
    <StyledForm onSubmit={handleSubmit}>
      {children}
    </StyledForm>
  );
};
  
export default Form;
