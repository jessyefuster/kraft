import { styled } from '@mui/material';

import logo from '../../assets/logo_white.svg';
import LogoutButton from '../../features/Auth/components/LogoutButton/LogoutButton';

const Logo = styled('img')({ });

const Header = styled('header')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  minWidth: 30,
  padding: 20,
  background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
}));

const AppBar = () => {
  return (
    <Header>
      <Logo src={logo} alt="Kraft" />
      <LogoutButton />
    </Header>
  );
};

export default AppBar;
