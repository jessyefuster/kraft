import ArrowBack from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetRoleQuery } from '../../../app/api';
import errorIllustrationUrl from '../../../assets/error_illustration.png';
import Page from '../../../components/layout/Page';
import type { Tab } from '../../../components/ui/Tabs';
import Tabs from '../../../components/ui/Tabs';

const Header = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start'
});

const RolePage = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const { data: role, isError } = useGetRoleQuery(id);

  const onBackButtonClick = useCallback(() => navigate('/roles'), [navigate]);

  const tabs = useMemo<Tab[]>(() => [
    {
      label: 'Détails',
      component: undefined
    },
    {
      label: 'Permissions',
      component: undefined
    },
    {
      label: 'Utilisateurs',
      component: undefined
    },
  ], []);

  return (
    <Page padding={4}>
      <Button
        onClick={onBackButtonClick}
        sx={{ padding: '8px', alignSelf: 'start' }}
        startIcon={<ArrowBack />}
      >
        Retour aux rôles
      </Button>
      {role
        ? <>
            <Header>
              <Typography variant="h4">{role.name}</Typography>
              <Typography variant="caption" marginTop={1}>ID du rôle <code>{id}</code></Typography>
            </Header>
            <Box flex={1} marginTop={4}>
              <Tabs tabs={tabs}/>
            </Box>
          </>
        : isError && (
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <img src={errorIllustrationUrl} height={350}/>
            </Box>
          )
      }
    </Page>
  );
};

export default RolePage;
