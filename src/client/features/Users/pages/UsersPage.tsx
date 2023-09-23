import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Avatar, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, styled } from '@mui/material';
import Typography from '@mui/material/Typography';

import Page from '../../../components/layout/Page';
import { useGetUsersQuery } from '../../../app/api';

const Header = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
})

interface Props {
  title: string;
}

const UsersPage = ({ title }: Props) => {
  const { data: users } = useGetUsersQuery();

  return (
    <Page>
      <Box padding={4}>
        <Header>
          <Typography variant='h4'>{title}</Typography>
          <Button variant='contained' startIcon={<AddCircleOutlineIcon />}>Nouvel utilisateur</Button>
        </Header>
        {users &&
          <TableContainer sx={{ marginTop: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Nom d'utilisateur</TableCell>
                  <TableCell align="right">E-mail</TableCell>
                  <TableCell align="right">Date de création</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.username}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Avatar>{user.username[0].toUpperCase()}</Avatar>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {user.username}
                    </TableCell>
                    <TableCell align="right">{user.email}</TableCell>
                    <TableCell align="right">{user.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        }
      </Box>
    </Page>
  );
};

export default UsersPage;
