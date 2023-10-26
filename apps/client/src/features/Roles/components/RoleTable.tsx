
import type { RoleDTO } from '@internal/types';
import DeleteIcon from '@mui/icons-material/Delete';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { IconButton } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDeleteRoleMutation } from '../../../app/api';
import AutoColoredChip from '../../../components/ui/AutoColoredChip';
import type { Props as ButtonWithConfirmDialogProps } from '../../../components/ui/ButtonWithConfirmDialog';
import ButtonWithConfirmDialog from '../../../components/ui/ButtonWithConfirmDialog';
import type { Column, TableProps } from '../../../components/ui/Table';
import Table from '../../../components/ui/Table';

interface Props {
  roles: RoleDTO[];
  containerProps?: TableProps['containerProps'];
}

const DeleteRoleButton = ({ onDeleteConfirm }: { onDeleteConfirm: () => void }) => {
  const dialogOptions = useMemo<ButtonWithConfirmDialogProps['dialogOptions']>(() => ({
    title: 'Supprimer le rôle ?',
    description: "La suppression ne sera effectuée que si aucun utilisateur n'a ce rôle d'attribué.",
    confirmText: 'Supprimer',
    confirmType: 'destructive'
  }), []);

  return (
    <ButtonWithConfirmDialog
      icon={useMemo(() => <DeleteIcon />, [])}
      dialogOptions={dialogOptions}
      onConfirm={onDeleteConfirm}
    />
  );
};

const ViewDetailButton = ({ id }: { id: string }) => {
  const navigate = useNavigate();

  const onClick = useCallback(() => {
    navigate(`/roles/${id}`);
  }, [id, navigate]);

  return (
    <IconButton onClick={onClick}>
      <ReadMoreIcon />
    </IconButton>
  );
};

const RoleTable = ({ roles, containerProps }: Props) => {
  const [deleteRole] = useDeleteRoleMutation();
  const onDeleteRoleConfirm = useCallback((userId: string) => deleteRole(userId), [deleteRole]);

  const table = useMemo(() => {
    const columns: Column[] = [
      { title: 'Nom du rôle' },
      { title: 'Description' },
      { title: 'Nombre de permissions', align: 'right' },
      { title: 'Actions', align: 'right' }
    ];
    const items = roles.map(role => ({
      key: role.id,
      data: {
        name: <AutoColoredChip labelStr={role.name} label={role.name} variant="outlined" />,
        description: role.description,
        permissions: role.permissionsCount,
        actions:
          <>
            <DeleteRoleButton onDeleteConfirm={() => onDeleteRoleConfirm(role.id)}/>
            <ViewDetailButton id={role.id} />
          </>
      }
    }));
  
    return {
      columns,
      items
    };
  }, [roles, onDeleteRoleConfirm]);

  return (
    <Table
      containerProps={containerProps}
      label="Liste des rôles"
      {...table}
    />
  );
};

export default RoleTable;
