import { Box, styled } from '@mui/material';

import loginIllustrationUrl from '../../../assets/login_illustration.jpg';
import FixedPage from '../../../components/layout/FixedPage';
import LoginForm from '../components/LoginForm/LoginForm';

const ImageContainer = styled(Box)({
  flex: 1,
});

const FormContainer = styled(Box)({
  minWidth: '40%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
});

const CoverImage = styled('img')({
  objectFit: 'cover',
  width: '100%',
  height: '100%'
});

const LoginPage = () => {
  return (
    <FixedPage>
      <ImageContainer flex={1}>
        <CoverImage src={loginIllustrationUrl} />
      </ImageContainer>
      <FormContainer padding={4}>
        <LoginForm />
      </FormContainer>
    </FixedPage>
  );
};

export default LoginPage;
