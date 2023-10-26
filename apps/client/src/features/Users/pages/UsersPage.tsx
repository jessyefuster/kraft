import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Button, styled } from '@mui/material';
import Typography from '@mui/material/Typography';

import { useGetUsersQuery } from '../../../app/api';
import Page from '../../../components/layout/Page';
import UserTable from '../components/UserTable';

const Header = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
});

interface Props {
  title: string;
}

const UsersPage = ({ title }: Props) => {
  const { data: users } = useGetUsersQuery();

  return (
    <Page padding={4}>
      <Header>
        <Typography variant="h4">{title}</Typography>
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />}>Nouvel utilisateur</Button>
      </Header>
      {users && (
        <Box flex={1} marginTop={4} position={'relative'}>
          <UserTable users={users} containerProps={{ position: 'absolute', height: '100%' }} />
        </Box>
      )}
    </Page>
  );
};

export default UsersPage;
