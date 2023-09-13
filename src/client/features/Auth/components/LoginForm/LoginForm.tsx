import { Visibility, VisibilityOff } from '@mui/icons-material';
import { styled } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import logo from '../../../../assets/logo.svg';
import { LoginFormData, useLoginForm } from '../../hooks/useLoginForm';

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
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useLoginForm();
  const onSubmit = (data: LoginFormData) => console.info(data);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Logo src={logo} alt="Kraft" />
      <Typography variant='h4' sx={{ mt: 3 }}>Hello !</Typography>
      <TextField
        label="Nom d'utilisateur"
        autoComplete="username"
        {...register('username', { required: true })}
        error={!!errors.username}
        helperText={errors.username && 'Saisissez votre nom d\'utilisateur' }
        sx={{ mt: 2 }}
      />
      <TextField
        label="Mot de passe"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        {...register('password', { required: true })}
        error={!!errors.password}
        helperText={errors.password && 'Saisissez votre mot de passe' }
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
  );
};
  
export default LoginForm;
