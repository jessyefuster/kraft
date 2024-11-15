import type { SxProps } from '@mui/material';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

import type { Props as PageProps } from '../components/layout/Page';
import Page from '../components/layout/Page';
import StateIllustration from '../components/ui/StateIllustration';

const pageSxProps: SxProps = {
  alignItems: 'center', 
  justifyContent: 'center', 
  textAlign: 'center'
};

interface Props extends Pick<PageProps, 'showAppBar' | 'showDrawer'> {
  title?: string;
}

// eslint-disable-next-line arrow-body-style
const NotFoundPage = ({ title = 'Page introuvable', showAppBar = true, showDrawer = false }: Props) => {
  return (
    <Page title={title} showAppBar={showAppBar} showDrawer={showDrawer} sx={pageSxProps}>
      <StateIllustration
        state="search"
        title={title}
        compensateImageOffset={true}
      >
        <Link to="/">
          <Button variant="contained">{"Retourner à l'accueil"}</Button>
        </Link>
      </StateIllustration>
    </Page>
  );
};

export default NotFoundPage;
