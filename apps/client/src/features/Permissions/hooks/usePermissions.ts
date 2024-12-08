import { useGetCurrentUserQuery } from '../../../app/api';

export const usePermissions = () => {
  const { data: user } = useGetCurrentUserQuery();
  const permissions = user?.role?.permissions?.map(permission => permission.code);

  return permissions;
};
