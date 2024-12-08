import type { UserDTO } from '@internal/types';
import { useMemo } from 'react';
import Avatar from 'boring-avatars';

import AutoColoredChip from '../../../components/ui/AutoColoredChip';
import type { Column } from '../../../components/ui/Table';
import { avatarColors } from '../../../theme/theme';
import { useHasPermissions } from '../../Permissions/hooks/useHasPermissions';
import DeleteUserButton from '../components/DeleteUserButton';

type UserColumn = 'avatar' | 'username' | 'email' | 'role' | 'createdAt' | 'actions';

type UserColumns<T> = {
  [key in UserColumn]: T;
};

export type ColumnsDisplay = UserColumns<boolean>;

export const useUserTableData = (users: UserDTO[]) => {
  const showRole = useHasPermissions(['read:roles']);
  const data = useMemo(() => {
    const columns: Column<UserColumn>[] = [
      { id: 'avatar', title: undefined, 'aria-label': 'Avatar' },
      { id: 'username', title: 'Nom d\'utilisateur' },
      { id: 'email', title: 'E-mail' },
      { id: 'role', title: 'Rôle', hidden: !showRole },
      { id: 'createdAt', title: 'Date de création', align: 'right' },
      { id: 'actions', title: 'Actions', align: 'right' }
    ];
    const items = users.map(user => ({
      id: user.id,
      primaryColumn: 'username' as UserColumn,
      data: {
        avatar: <Avatar name={user.username} size={30} variant="beam" colors={avatarColors} />,
        username: user.username,
        email: user.email,
        role: user.role && <AutoColoredChip label={user.role.name} labelStr={user.role.name} variant="outlined" />,
        createdAt: user.createdAt,
        actions: <DeleteUserButton id={user.id} />
      } as UserColumns<React.ReactNode>
    }));
  
    return {
      columns,
      items
    };
  }, [users, showRole]);

  return data;
};
