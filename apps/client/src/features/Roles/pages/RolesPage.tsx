import type { RoleDTO } from '@internal/types';
import { Box, styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGetRolesQuery } from '../../../app/api';
import Page from '../../../components/layout/Page';
import Table from '../../../components/ui/Table';
import CreateRoleButton from '../components/CreateRoleButton';
import { useRoleTableData } from '../hooks/useRoleTableData';

const Header = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
});

interface Props {
  title: string;
}

const RolesPage = ({ title }: Props) => {
  const navigate = useNavigate();
  const { data: roles = [] } = useGetRolesQuery();
  const tableData = useRoleTableData(roles);

  const onCreateRole = useCallback((role: RoleDTO) => navigate(role.id), [navigate]);

  return (
    <Page title={title} padding={4}>
      <Header>
        <Typography variant="h4">{title}</Typography>
        <CreateRoleButton onCreateRole={onCreateRole}/>
      </Header>
      {!!roles.length && (
        <Box flex={1} marginTop={4} position={'relative'}>
          <Table
            {...tableData}
            label="Liste des rôles"
            containerProps={{ position: 'absolute', height: '100%' }}
          />
        </Box>
      )}
    </Page>
  );
};

export default RolesPage;
