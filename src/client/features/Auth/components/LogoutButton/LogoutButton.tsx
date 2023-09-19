import { Logout } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';

import { useLogOutMutation } from '../../../../app/api';

const LogoutButton = () => {
  const [logOut] = useLogOutMutation();
  const navigate = useNavigate();

  const onClick = () => {
    logOut(undefined);
    navigate('/');
  }

  return (
    <Tooltip title="Se déconnecter" placement='right'>
      <IconButton
        onClick={onClick}
        color="inherit"
        sx={{
          border: '1px solid',
          borderColor: 'inherit',
          borderRadius: '35%'
        }}
      >
        <Logout />
      </IconButton>
    </Tooltip>
  );
};

export default LogoutButton;
