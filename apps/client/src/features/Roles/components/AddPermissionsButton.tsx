import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import { useMemo } from 'react';

interface Props extends ButtonProps {}

const AddPermissionsButton = ({ ...rest }: Props) => (
  <Button
    variant="contained"
    startIcon={useMemo(() => <AddCircleOutlineIcon />, [])}
    {...rest}
  >
    Ajouter des permissions
  </Button>
);

export default AddPermissionsButton;
