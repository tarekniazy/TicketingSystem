import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

function Auth0ProviderWithNavigate({ children }: { children: React.ReactNode }) {

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/auth/callback`,
      }}
    >
      {children}
    </Auth0Provider>
  );
}

function App() {
  return (
    <BrowserRouter> 
      <Auth0ProviderWithNavigate>
        <AuthProvider>
          <CssBaseline />
          <AppRoutes />
        </AuthProvider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  );
}

export default App;
