import { Button, TextField, styled } from '@mui/material';

const Form = styled('form')({
  minWidth: '40%',
  display: 'flex',
  flexDirection: 'column'
});

const LoginForm = () => {
  return (
    <Form>
      <TextField label="Nom d'utilisateur" variant="outlined" />
      <TextField label="Mot de passe" variant="outlined" type="password" />
      <Button variant="contained">Se connecter</Button>
    </Form>
  );
};
  
export default LoginForm;
