
import type { RoleDTO } from '@internal/types';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCallback, useMemo } from 'react';

import { useDeleteRoleMutation } from '../../../app/api';
import AutoColoredChip from '../../../components/ui/AutoColoredChip';
import type { Props as ButtonWithConfirmDialogProps } from '../../../components/ui/ButtonWithConfirmDialog';
import ButtonWithConfirmDialog from '../../../components/ui/ButtonWithConfirmDialog';
import type { Column } from '../../../components/ui/Table';
import Table from '../../../components/ui/Table';

interface Props {
  roles: RoleDTO[];
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

const RoleTable = ({ roles }: Props) => {
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
        // eslint-disable-next-line @arthurgeron/react-usememo/require-usememo
        actions: <DeleteRoleButton onDeleteConfirm={() => onDeleteRoleConfirm(role.id)}/>
      }
    }));
  
    return {
      columns,
      items
    };
  }, [roles, onDeleteRoleConfirm]);

  return (
    <Table
      label="Liste des rôles"
      {...table}
    />
  );
};

export default RoleTable;
