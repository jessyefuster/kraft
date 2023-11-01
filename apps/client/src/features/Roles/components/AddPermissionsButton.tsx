import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import { useCallback, useMemo, useState } from 'react';

import Drawer from '../../../components/ui/Drawer';
import { useGetPermissionsQuery } from '../../../app/api';
import PermissionTable from './PermissionTable';
import type { Props as PermissionTableProps } from './PermissionTable';

const columnsDisplay: PermissionTableProps['columnsDisplay'] = {
  code: true,
  description: true,
  group: false,
  actions: false
};

interface Props extends ButtonProps {}

const AddPermissionsButton = ({ ...rest }: Props) => {
  const { data: permissions = [] } = useGetPermissionsQuery();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const onClick = useCallback(() => setIsFormOpen(true), []);
  const onDrawerClose = useCallback(() => setIsFormOpen(false), []);

  return (
    <>
      <Button
        {...rest}
        variant="contained"
        startIcon={useMemo(() => <AddCircleOutlineIcon />, [])}
        onClick={onClick}
      >
        Ajouter des permissions
      </Button>
      <Drawer
        title="Ajouter des permissions"
        isOpen={isFormOpen}
        onClose={onDrawerClose}
        size="large"
      >
        <PermissionTable permissions={permissions} columnsDisplay={columnsDisplay} />
      </Drawer>
    </>
  );
};

export default AddPermissionsButton;
