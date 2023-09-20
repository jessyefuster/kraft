import Typography from '@mui/material/Typography';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import Page from '../../../components/layout/Page';

interface Props {
  title: string;
}

function createUserRow(
  username: string,
  email: string,
  creationDate: number,
  lastActivityDate: number
) {
  return { username, email, creationDate, lastActivityDate };
}

const rows = [
  createUserRow('jessyef', 'j.fuster@arpege.fr', 12358713, 2412358713),
  createUserRow('francoisc', 'f.chevalier@arpege.fr', 12358713, 2412358713),
  createUserRow('philippej', 'p.jovelin@arpege.fr', 112358713, 2412358713),
  createUserRow('vincentc', 'v.chusseau@arpege.fr', 12358713, 2412358713),
  createUserRow('leol', 'l.lebreton@arpege.fr', 12358713, 2412358713),
];

const UsersPage = ({ title }: Props) => {
  return (
    <Page>
      <Box padding={4}>
        <Typography variant='h4'>{title}</Typography>
        <TableContainer sx={{ marginTop: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nom d'utilisateur</TableCell>
                <TableCell align="right">E-mail</TableCell>
                <TableCell align="right">Date de création</TableCell>
                <TableCell align="right">Dernière activité</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.username}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.username}
                  </TableCell>
                  <TableCell align="right">{row.email}</TableCell>
                  <TableCell align="right">{row.creationDate}</TableCell>
                  <TableCell align="right">{row.lastActivityDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Page>
  );
};

export default UsersPage;
