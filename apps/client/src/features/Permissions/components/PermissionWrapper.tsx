import type { AnyPermission } from '@internal/types';
import type { PropsWithChildren } from 'react';

import { useHasPermissions } from '../hooks/useHasPermissions';

interface Props extends PropsWithChildren {
  requiredPermissions: AnyPermission[];
  fallbackComponent?: React.ReactNode;
}

const PermissionWrapper = ({ requiredPermissions, children, fallbackComponent }: Props) => {
  const hasPermissions = useHasPermissions(requiredPermissions);

  if (!hasPermissions) {
    return fallbackComponent ?? null;
  }

  return children;
};

export default PermissionWrapper;
