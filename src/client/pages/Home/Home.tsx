import { Typography } from '@mui/material';

import FixedPage from '../../components/layout/FixedPage';

const Home = () => {
  return (
    <FixedPage sx={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Typography variant='h2'>Bienvenue</Typography>
    </FixedPage>
  );
};

export default Home;
