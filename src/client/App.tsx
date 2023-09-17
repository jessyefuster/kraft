import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from './app/store';
import PrivateOutlet from './features/Auth/components/PrivateOutlet/PrivateOutlet';
import LoginPage from './features/Auth/pages/LoginPage';
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';
import { themeOptions } from './theme/theme';

const theme = createTheme(themeOptions);

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={theme}>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<PrivateOutlet />}>
                <Route index element={<HomePage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
