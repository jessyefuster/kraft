import type { PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import emptyIllustrationUrl from '../../assets/empty_illustration.png';
import errorIllustrationUrl from '../../assets/error_illustration.png';
import locationIllustrationUrl from '../../assets/location_illustration.png';
import searchIllustrationUrl from '../../assets/search_illustration.png';
import idleIllustrationUrl from '../../assets/idle_illustration.png';

type State = 'empty' | 'error' | 'location' | 'search' | 'idle';

const stateIllustrations: Record<State, string> = {
  empty: emptyIllustrationUrl,
  error: errorIllustrationUrl,
  location: locationIllustrationUrl,
  search: searchIllustrationUrl,
  idle: idleIllustrationUrl,
};

const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center'
});

interface Props {
  state?: State;
  title?: string;
  message?: string;
  compensateImageOffset?: boolean;
}

// eslint-disable-next-line arrow-body-style
const StateIllustration = ({ title, message, compensateImageOffset, state = 'idle', children }: PropsWithChildren<Props>) => {
    return (
      <Container marginTop={compensateImageOffset ? -6 : undefined}>
        <img src={stateIllustrations[state]} height={350}/>
        <Box marginTop={-6} sx={{ ':empty': { display: 'none' } }}>
          {title && <Typography variant="h4">{title}</Typography>}
          {message && <Typography variant="body1" mt={1}>{message}</Typography>}
          {children && (<Box marginTop={3}>{children}</Box>)}
        </Box>
      </Container>
    );
};

export default StateIllustration;
