import type { BoxProps } from '@mui/material';
import { Box, styled } from '@mui/material';
import type { PropsWithChildren } from 'react';

import AppBar from './AppBar';
import NavigationDrawer from './NavigationDrawer';

interface MainProps {
  $orientation: 'row' | 'column';
}

const Main = styled(Box, {
  shouldForwardProp: (propName: PropertyKey) => !propName.toString().startsWith('$')
})<MainProps>(({ $orientation }) => ({
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

// eslint-disable-next-line arrow-body-style
const Page = ({ orientation = 'column', showAppBar = true, showDrawer = true, children, ...rest }: Props) => {
  return (
    <Container>
      {showAppBar && <AppBar />}
      {showDrawer && <NavigationDrawer />}
      <Main as="main" $orientation={orientation} {...rest}>
        {children}
      </Main>
    </Container>
  );
};

export default Page;
