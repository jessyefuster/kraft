import Avatar from '@mui/material/Avatar';

import Table, { Column } from '../../../components/ui/Table';
import { UserDTO } from '../../../lib/api/models/users';

const formatTable = (users: UserDTO[]) => {
  const columns: Column[] = [
    { title: undefined, 'aria-label': 'Avatar' },
    { title: 'Nom d\'utilisateur' },
    { title: 'E-mail' },
    { title: 'Date de création', align: 'right' }
  ];
  const items = users.map(user => ({
    key: user.id,
    data: {
      avatar: <Avatar>{user.username[0].toUpperCase()}</Avatar>,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    }
  }));

  return {
    columns,
    items
  };
}

interface Props {
  users: UserDTO[];
}

const UserTable = ({ users }: Props) => {
  return (
    <Table
      label='Liste des utilisateurs'
      {...formatTable(users)}
    />
  );
};

export default UserTable;
