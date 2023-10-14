import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Box, Button, styled } from '@mui/material';
import Typography from '@mui/material/Typography';

import { useGetRolesQuery } from '../../../app/api';
import Page from '../../../components/layout/Page';
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
    <Page>
      <Box padding={4}>
        <Header>
          <Typography variant="h4">{title}</Typography>
          <Button variant="contained" startIcon={<AddCircleOutlineIcon />}>Nouveau rôle</Button>
        </Header>
        {roles && <RoleTable roles={roles} />}
      </Box>
    </Page>
  );
};

export default RolesPage;