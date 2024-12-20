import type { BoxProps } from '@mui/material';
import { Box, styled } from '@mui/material';
import { useEffect, type PropsWithChildren } from 'react';

import AppBar from './AppBar';
import NavigationDrawer from './NavigationDrawer';

interface MainProps {
  $orientation: 'row' | 'column';
}

const Main = styled(Box, {
  shouldForwardProp: (propName: PropertyKey) => !propName.toString().startsWith('$')
})<MainProps>(({ $orientation }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: $orientation,
}));

const Container = styled(Box)({
  height: '100vh',
  display: 'flex'
});

export interface Props extends PropsWithChildren, BoxProps {
  showAppBar?: boolean;
  showDrawer?: boolean;
  orientation?: 'row' | 'column';
}

const Page = ({ orientation = 'column', showAppBar = true, showDrawer = true, title, children, ...rest }: Props) => {

  useEffect(() => {
    document.title = title ? `${title} - Kraft` : 'Kraft';
  }, [title]);  

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
