import { useMemo } from 'react';

import { selectCurrentUser } from '../store/selectors';
import { useAppSelector } from '../../../hooks/store';

export const useAuth = () => {
  const user = useAppSelector(selectCurrentUser);

  return useMemo(() => ({ user }), [user]);
};
