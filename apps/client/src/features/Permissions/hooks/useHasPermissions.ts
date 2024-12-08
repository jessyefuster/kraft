import type { AnyPermission } from '@internal/types';

import { usePermissions } from './usePermissions';

export const useHasPermissions = (requiredPermissions: AnyPermission[]) => {
  const permissions = usePermissions();

  return requiredPermissions.every(requiredPermission => permissions?.includes(requiredPermission));
};
