import { Box, BoxProps, styled } from '@mui/material';
import { PropsWithChildren } from 'react';

import AppBar from './AppBar';
import Drawer from './Drawer';

interface MainProps {
  $orientation: 'row' | 'column'
}

const Main = styled(Box)<MainProps>(({ $orientation }) => ({
  display: 'flex',
  height: '100%',
  flex: 1,
  flexDirection: $orientation,
}));

const Container = styled(Box)({
  height: '100vh',
  display: 'flex'
});

interface Props extends PropsWithChildren, BoxProps {
  showAppBar?: boolean;
  showDrawer?: boolean;
  orientation?: 'row' | 'column';
}

const Page = ({ orientation = 'column', showAppBar = true, showDrawer = true, children, ...rest }: Props) => {
  return (
    <Container>
      {showAppBar && <AppBar />}
      {showDrawer && <Drawer />}
      <Main as="main" $orientation={orientation} {...rest}>
        {children}
      </Main>
    </Container>
  );
};

export default Page;
