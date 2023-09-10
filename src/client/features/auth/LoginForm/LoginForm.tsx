import { Button, TextField, Typography, styled } from '@mui/material';

import logo from '../../../assets/logo.svg';

const Logo = styled('img')({
  height: 50,
  alignSelf: 'center'
});

const Form = styled('form')({
  width: '400px',
  maxWidth: '100%',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column'
});

const LoginForm = () => {
  return (
    <Form>
      <Logo src={logo} alt="Kraft" />
      <Typography variant='h4' sx={{ mt: 3 }}>Hello !</Typography>
      <TextField label="Nom d'utilisateur" sx={{ mt: 2 }}/>
      <TextField label="Mot de passe" type="password" sx={{ mt: 2 }} />
      <Button variant="contained" sx={{ mt: 3 }}>Se connecter</Button>
    </Form>
  );
};
  
export default LoginForm;
