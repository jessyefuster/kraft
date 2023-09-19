import { Box, Typography } from '@mui/material';

import Page from '../components/layout/Page';
import { useAuth } from '../features/Auth/hooks/useAuth';

const HomePage = () => {
  const auth = useAuth();

  return (
    <Page sx={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Box>
        <Typography variant='h2' marginBottom={4}>Bienvenue {auth.user?.username}</Typography>
      </Box>
    </Page>
  );
};

export default HomePage;
