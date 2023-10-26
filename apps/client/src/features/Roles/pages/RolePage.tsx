import { Box, styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';

import Page from '../../../components/layout/Page';

const Header = styled(Box)({
  display: 'flex',
  flexDirection: 'column'
});

const RolePage = () => {
  const { id } = useParams();

  return (
    <Page padding={4}>
      <Header>
        <Typography variant="h4">Détail du rôle</Typography>
        <Typography variant="overline">{id}</Typography>
      </Header>
    </Page>
  );
};

export default RolePage;
