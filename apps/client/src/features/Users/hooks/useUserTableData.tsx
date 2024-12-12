import type { UserDTO } from '@internal/types';
import { useMemo } from 'react';
import Avatar from 'boring-avatars';

import AutoColoredChip from '../../../components/ui/AutoColoredChip';
import type { Column } from '../../../components/ui/Table';
import { avatarColors } from '../../../theme/theme';
import { useHasPermissions } from '../../Permissions/hooks/useHasPermissions';

type UserColumn = 'avatar' | 'username' | 'email' | 'role' | 'createdAt' | 'actions';

type UserColumns<T> = {
  [key in UserColumn]: T;
};

export type ColumnsDisplay = Partial<UserColumns<boolean>>;

type RenderActionsCallback = ({ userId }: {
  userId: string;
}) => React.ReactNode;

interface Options {
  renderActions?: RenderActionsCallback;
  columnsDisplay?: ColumnsDisplay;
}

export const useUserTableData = (users: UserDTO[], options?: Options) => {
  const showRole = useHasPermissions(['read:roles']);
  const data = useMemo(() => {
    const columns: Column<UserColumn>[] = [
      { id: 'avatar', title: undefined, 'aria-label': 'Avatar', hidden: options?.columnsDisplay?.avatar === false },
      { id: 'username', title: 'Nom d\'utilisateur', hidden: options?.columnsDisplay?.username === false },
      { id: 'email', title: 'E-mail', hidden: options?.columnsDisplay?.email === false },
      { id: 'role', title: 'Rôle', hidden: !showRole || options?.columnsDisplay?.role === false },
      { id: 'createdAt', title: 'Date de création', align: 'right', hidden: options?.columnsDisplay?.createdAt === false },
      { id: 'actions', title: 'Actions', align: 'right', hidden: options?.columnsDisplay?.actions === false }
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
        actions: options?.renderActions ? options.renderActions({ userId: user.id }) : null
      } as UserColumns<React.ReactNode>
    }));
  
    return {
      columns,
      items
    };
  }, [users, showRole, options]);

  return data;
};
