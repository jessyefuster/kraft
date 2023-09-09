import { Box, styled } from '@mui/material';

import loginIllustrationUrl from '../../assets/login_illustration.jpg';
import FixedPage from '../../components/layout/FixedPage';
import LoginForm from '../../features/auth/LoginForm/LoginForm';

const ImageContainer = styled(Box)({
  flex: 1,
});

const CoverImage = styled('img')({
  objectFit: 'cover',
  width: '100%',
  height: '100%'
});

const Login = () => {
  return (
    <FixedPage>
      <ImageContainer flex={1}>
        <CoverImage src={loginIllustrationUrl} />
      </ImageContainer>
      <LoginForm />
    </FixedPage>
  );
};

export default Login;
