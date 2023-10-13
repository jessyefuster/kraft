import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import Page from '../components/layout/Page';

// eslint-disable-next-line arrow-body-style
const NotFoundPage = () => {
  return (
    <Page showAppBar={true} showDrawer={false} sx={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Box>
        <Typography variant="h2" marginBottom={4}>Page introuvable</Typography>
        <Link to="/">
          <Button variant="contained">{"Retourner à l'accueil"}</Button>
        </Link>
      </Box>
    </Page>
  );
};

export default NotFoundPage;
