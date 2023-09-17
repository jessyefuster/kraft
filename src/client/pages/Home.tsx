import { Box, Typography } from '@mui/material';

import FixedPage from '../components/layout/FixedPage';
import { useAuth } from '../features/Auth/hooks/useAuth';

const HomePage = () => {
  const auth = useAuth();

  return (
    <FixedPage sx={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Box>
        <Typography variant='h2' marginBottom={4}>Bienvenue {auth.user?.username}</Typography>
      </Box>
    </FixedPage>
  );
};

export default HomePage;
