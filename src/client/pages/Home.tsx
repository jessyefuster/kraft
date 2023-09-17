import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import FixedPage from '../components/layout/FixedPage';

const HomePage = () => {
  return (
    <FixedPage sx={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Box>
        <Typography variant='h2' marginBottom={4}>Bienvenue</Typography>
        <Link to="login">
          <Button variant='contained'>Se connecter</Button>
        </Link>
      </Box>
    </FixedPage>
  );
};

export default HomePage;
