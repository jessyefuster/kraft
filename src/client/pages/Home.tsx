import { Box, Typography } from '@mui/material';

import Page from '../components/layout/Page';
import LogoutButton from '../features/Auth/components/LogoutButton/LogoutButton';
import { useAuth } from '../features/Auth/hooks/useAuth';

const HomePage = () => {
  const auth = useAuth();

  return (
    <Page sx={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Box>
        <Typography variant='h2' marginBottom={4}>Bienvenue {auth.user?.username}</Typography>
        <LogoutButton />
      </Box>
    </Page>
  );
};

export default HomePage;
