import { Box, styled } from '@mui/material';

import loginIllustrationUrl from '../../../assets/login_illustration.jpg';
import Page from '../../../components/layout/Page';
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

interface Props {
  title?: string;
}

// eslint-disable-next-line arrow-body-style
const LoginPage = ({ title }: Props) => {
  return (
    <Page title={title} orientation="row" showAppBar={false} showDrawer={false}>
      <ImageContainer flex={1}>
        <CoverImage src={loginIllustrationUrl} />
      </ImageContainer>
      <FormContainer padding={4}>
        <LoginForm />
      </FormContainer>
    </Page>
  );
};

export default LoginPage;
