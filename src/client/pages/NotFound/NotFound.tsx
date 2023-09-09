import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import FixedPage from '../../components/layout/FixedPage';

const NotFound = () => {
  return (
    <FixedPage sx={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Box>
        <Typography variant='h2' marginBottom={4}>Page introuvable</Typography>
        <Link to="/">
          <Button variant='contained'>Retourner à l'accueil</Button>
        </Link>
      </Box>
    </FixedPage>
  );
};

export default NotFound;
