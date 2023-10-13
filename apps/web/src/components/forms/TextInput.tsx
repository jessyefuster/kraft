import type { TextFieldProps } from '@mui/material';
import { TextField } from '@mui/material';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

type Props<TFieldValues extends FieldValues> = Omit<TextFieldProps, 'name'> & {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
};

// eslint-disable-next-line arrow-body-style
const TextInput = <T extends FieldValues>({ name, control, ...rest }: Props<T> ) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...rest}
          {...field}
          error={fieldState.invalid}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
};

export default TextInput;
