import { styled } from '@mui/material';

const Header = styled('header')(({ theme }) => ({
  height: '100vh',
  width: 70,
  background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
}));

const AppBar = () => {
  return (
    <Header></Header>
  );
};

export default AppBar;
