
import type { RoleDTO } from '@internal/types';
import AutoColoredChip from '../../../components/ui/AutoColoredChip';
import type { Column } from '../../../components/ui/Table';
import Table from '../../../components/ui/Table';

const formatTable = (roles: RoleDTO[]) => {
  const columns: Column[] = [
    { title: 'Nom du rôle' },
    { title: 'Nombre de permissions', align: 'right' }
  ];
  const items = roles.map(role => ({
    key: role.id,
    data: {
      name: <AutoColoredChip labelStr={role.name} label={role.name} variant="outlined" />,
      permissions: role.permissions?.length
    }
  }));

  return {
    columns,
    items
  };
}

interface Props {
  roles: RoleDTO[];
}

// eslint-disable-next-line arrow-body-style
const RoleTable = ({ roles }: Props) => {
  return (
    <Table
      label="Liste des rôles"
      {...formatTable(roles)}
    />
  );
};

export default RoleTable;
