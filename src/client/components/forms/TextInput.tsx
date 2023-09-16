import { TextField, TextFieldProps } from "@mui/material";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

type Props<TFieldValues extends FieldValues> = Omit<TextFieldProps, 'name'> & {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>
};

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
