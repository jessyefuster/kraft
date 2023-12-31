import { Box, styled } from '@mui/material';
import Typography from '@mui/material/Typography';

import { useGetRolesQuery } from '../../../app/api';
import Page from '../../../components/layout/Page';
import CreateRoleButton from '../components/CreateRoleButton';
import RoleTable from '../components/RoleTable';

const Header = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
});

interface Props {
  title: string;
}

const RolesPage = ({ title }: Props) => {
  const { data: roles } = useGetRolesQuery();

  return (
    <Page padding={4}>
      <Header>
        <Typography variant="h4">{title}</Typography>
        <CreateRoleButton />
      </Header>
      {roles && (
        <Box flex={1} marginTop={4} position={'relative'}>
          <RoleTable roles={roles} containerProps={{ position: 'absolute', height: '100%' }} />
        </Box>
      )}
    </Page>
  );
};

export default RolesPage;
