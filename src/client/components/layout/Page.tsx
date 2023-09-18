import { Box, BoxProps, styled } from '@mui/material';
import { PropsWithChildren } from 'react';

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
  orientation?: 'row' | 'column'
}

const Page = ({ children, orientation = 'column', ...rest }: Props) => {
  return (
    <Container>
      <Main as="main" $orientation={orientation} {...rest}>
        {children}
      </Main>
    </Container>
  );
};

export default Page;
