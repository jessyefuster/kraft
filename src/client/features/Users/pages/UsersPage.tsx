import Typography from '@mui/material/Typography';

import Page from '../../../components/layout/Page';

interface Props {
  title: string;
}

const UsersPage = ({ title }: Props) => {
  return (
    <Page padding={4}>
       <Typography variant='h3'>{title}</Typography>
    </Page>
  );
};

export default UsersPage;
