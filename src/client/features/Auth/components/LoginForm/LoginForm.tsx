import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, styled } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import logo from '../../../../assets/logo.svg';
import Form from '../../../../components/forms/Form';
import TextInput from '../../../../components/forms/TextInput';
import { useLoginForm } from '../../hooks/useLoginForm';

const Logo = styled('img')({
  height: 50,
  alignSelf: 'center'
});

const FormContainer = styled(Box)({
  width: '400px',
  maxWidth: '100%',
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column'
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { form, requiredFields } = useLoginForm({ defaultValues: { username: '', password: '' } });
  const onSubmit = (data: unknown) => console.info(data);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <FormContainer>
      <Logo src={logo} alt="Kraft" />
      <Typography variant='h4' sx={{ mt: 3 }}>Hello !</Typography>
      <Form form={form} onSubmit={onSubmit}>
        <TextInput
          label="Nom d'utilisateur"
          name="username"
          autoComplete="username"
          control={form.control}
          required={requiredFields.username}
          sx={{ mt: 2 }}
        />
        <TextInput
          label="Mot de passe"
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          control={form.control}
          required={requiredFields.password}
          sx={{ mt: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button type="submit" variant="contained" sx={{ mt: 3 }}>Se connecter</Button>
      </Form>
    </FormContainer>
  );
};
  
export default LoginForm;
