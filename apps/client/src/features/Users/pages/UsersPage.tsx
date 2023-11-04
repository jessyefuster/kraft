import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Button, styled } from '@mui/material';
import Typography from '@mui/material/Typography';

import { useGetUsersQuery } from '../../../app/api';
import Page from '../../../components/layout/Page';
import Table from '../../../components/ui/Table';
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
  const { data: users = [] } = useGetUsersQuery();
  const tableData = useUserTableData(users);

  return (
    <Page padding={4}>
      <Header>
        <Typography variant="h4">{title}</Typography>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />}>Nouvel utilisateur</Button>
      </Header>
      {!!users.length && (
        <Box flex={1} marginTop={4} position={'relative'}>
          <Table
            {...tableData}
            label="Liste des utilisateurs"
            containerProps={{ position: 'absolute', height: '100%' }}
          />
        </Box>
      )}
    </Page>
  );
};

export default UsersPage;
