import type {
  FormControlProps
} from '@mui/material';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect
} from '@mui/material';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

export interface SelectItem {
  value: string;
  label: string;
}

interface Props<TFieldValues extends FieldValues> {
  label: string;
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  items: SelectItem[];
  required?: boolean;
  containerProps?: FormControlProps;
}

// eslint-disable-next-line arrow-body-style
const Select = <T extends FieldValues>({ label, name, control, items, required, containerProps }: Props<T>) => {
  return (
    <FormControl {...containerProps} required={required}>
      <InputLabel>{label}</InputLabel>
      <Controller
        control={control}
        name={name}
        // eslint-disable-next-line @arthurgeron/react-usememo/require-usememo
        render={({ field }) => (
          <MuiSelect
            label={label}
            {...field}
          >
            {required === false && (
              <MenuItem value={undefined}>
                <em>Aucun</em>
              </MenuItem>
            )}
            {items.map(item => (
              <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
            ))}
          </MuiSelect>
        )}
      />
    </FormControl>
  );
};

export default Select;
