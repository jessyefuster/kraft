import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { routes } from './app/constants/routes';
import { persistor, store } from './app/store';
import { themeOptions } from './theme/theme';

const theme = createTheme(themeOptions);

const router = createBrowserRouter(routes);

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
