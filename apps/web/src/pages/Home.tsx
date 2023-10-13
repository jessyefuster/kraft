import type { SxProps } from '@mui/material';
import { Box, Typography } from '@mui/material';

import Page from '../components/layout/Page';
import { useAuth } from '../features/Auth/hooks/useAuth';

const pageSxProps: SxProps = {
  alignItems: 'center', 
  justifyContent: 'center', 
  textAlign: 'center'
};

const HomePage = () => {
  const auth = useAuth();

  return (
    <Page sx={pageSxProps}>
      <Box>
        <Typography variant="h2" marginBottom={4}>Bienvenue {auth.user?.username}</Typography>
      </Box>
    </Page>
  );
};

export default HomePage;
