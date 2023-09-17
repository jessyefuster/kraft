import LoadingButton from '@mui/lab/LoadingButton';

import { useLogOutMutation } from '../../../../app/api';

const LogoutButton = () => {
  const [logOut, { isLoading }] = useLogOutMutation();

  const onClick = () => {
    logOut(undefined);
  }

  return (
    <LoadingButton
      onClick={onClick}
      loading={isLoading}
      variant="contained"
      color="error"
    >
      Déconnexion
    </LoadingButton>
  );
};

export default LogoutButton;
