import { styled } from '@mui/material';
import { PropsWithChildren } from 'react';
import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';

interface Props<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  children: React.ReactNode[];
}

const StyledForm = styled('form')({
  display: 'flex',
  flexDirection: 'column'
});

const Form = <T extends FieldValues>({ form, onSubmit, children }: PropsWithChildren<Props<T>>) => {
  const { handleSubmit } = form;

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      {children}
    </StyledForm>
  );
};
  
export default Form;
