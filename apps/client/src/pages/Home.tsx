import type { SxProps } from '@mui/material';

import Page from '../components/layout/Page';
import StateIllustration from '../components/ui/StateIllustration';
import { useAuth } from '../features/Auth/hooks/useAuth';

const pageSxProps: SxProps = {
  alignItems: 'center', 
  justifyContent: 'center', 
  textAlign: 'center'
};

interface Props {
  title?: string;
}

const HomePage = ({ title }: Props) => {
  const auth = useAuth();

  return (
    <Page title={title} sx={pageSxProps}>
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
