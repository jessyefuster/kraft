import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

import type { Props as PageProps } from '../components/layout/Page';
import Page from '../components/layout/Page';

interface Props extends Pick<PageProps, 'showAppBar' | 'showDrawer'> {
  title?: string;
}

// eslint-disable-next-line arrow-body-style
const NotFoundPage = ({ title = 'Page introuvable', showAppBar = true, showDrawer = false }: Props) => {
  return (
    <Page showAppBar={showAppBar} showDrawer={showDrawer} sx={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Box>
        <Typography variant="h2" marginBottom={4}>{title}</Typography>
        <Link to="/">
          <Button variant="contained">{"Retourner à l'accueil"}</Button>
        </Link>
      </Box>
    </Page>
  );
};

export default NotFoundPage;
