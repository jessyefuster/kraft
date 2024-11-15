import type { SxProps } from '@mui/material';

import Page from '../components/layout/Page';
import StateIllustration from '../components/ui/StateIllustration';
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
      <StateIllustration
        state="location"
        title={`Bienvenue ${auth.user?.username}`}
        message="Il n'y rien à faire ici pour le moment"
        compensateImageOffset={true}
      />
    </Page>
  );
};

export default HomePage;
