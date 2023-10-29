import ArrowBack from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useGetRolePermissionsQuery, useGetRoleQuery } from '../../../app/api';
import Page from '../../../components/layout/Page';
import StateIllustration from '../../../components/ui/StateIllustration';
import type { Tab } from '../../../components/ui/Tabs';
import Tabs from '../../../components/ui/Tabs';
import EditRoleDetailsForm from '../components/EditRoleDetailsForm';
import PermissionsPanel from '../components/PermissionsPanel';
import UsersPanel from '../components/UsersPanel';

const Header = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start'
});

const RolePage = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const { data: role, isError } = useGetRoleQuery(id);
  const { data: permissions = [] } = useGetRolePermissionsQuery(id);

  const onBackButtonClick = useCallback(() => navigate('/roles'), [navigate]);

  const tabs = useMemo<Tab[]>(() => [
    {
      label: 'Détails',
      component: <EditRoleDetailsForm role={role} />
    },
    {
      label: 'Permissions',
      component: <PermissionsPanel permissions={permissions}/>
    },
    {
      label: 'Utilisateurs',
      component: <UsersPanel />
    },
  ], [role, permissions]);

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
            <Box display="flex" flexDirection="column" flex={1} marginTop={4}>
              <Tabs tabs={tabs}/>
            </Box>
          </>
        : isError && (
            <StateIllustration
              state="error"
              title="Uh-oh"
              message="Impossible de récupérer l'élément"
            />
          )
      }
    </Page>
  );
};

export default RolePage;
