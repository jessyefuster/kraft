import { useMemo } from 'react';

import { Box, styled } from '@mui/material';
import Typography from '@mui/material/Typography';

import { useGetUsersQuery } from '../../../app/api';
import Page from '../../../components/layout/Page';
import StateIllustration from '../../../components/ui/StateIllustration';
import Table from '../../../components/ui/Table';
import PermissionWrapper from '../../Permissions/components/PermissionWrapper';
import { useHasPermissions } from '../../Permissions/hooks/useHasPermissions';
import CreateUserButton from '../components/CreateUserButton';
import DeleteUserButton from '../components/DeleteUserButton';
import { useUserTableData } from '../hooks/useUserTableData';

const Header = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
});

interface Props {
  title: string;
}

const UsersPage = ({ title }: Props) => {
  const showDeleteAction = useHasPermissions(['delete:users']);
  const { data: users = [], isError } = useGetUsersQuery();
  const tableData = useUserTableData(users, useMemo(() => ({
    renderActions: ({ userId }) =>
      // eslint-disable-next-line react/jsx-no-useless-fragment
      <>
        {showDeleteAction && <DeleteUserButton id={userId} />}
      </>
  }), [showDeleteAction]));

  return (
    <Page title={title} padding={4}>
      <Header>
        <Typography variant="h4">{title}</Typography>
        <PermissionWrapper requiredPermissions={['create:users']}>
          <CreateUserButton />
        </PermissionWrapper>
      </Header>
      {users.length
        ? (
          <Box flex={1} marginTop={4} position={'relative'}>
            <Table
              {...tableData}
              label="Liste des utilisateurs"
              containerProps={{ position: 'absolute', height: '100%' }}
            />
          </Box>
        )
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

export default UsersPage;
