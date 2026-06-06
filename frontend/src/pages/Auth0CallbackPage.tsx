import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { auth0SignIn } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';

const Auth0CallbackPage: React.FC = () => {
  const { isAuthenticated, isLoading, error, getIdTokenClaims } = useAuth0();
  const { login } = useAuth();
  const navigate = useNavigate();
  const hasExchanged = useRef(false);

  useEffect(() => {
    if (isLoading || hasExchanged.current) return;

    if (error) {
      navigate('/login');
      return;
    }

    if (isAuthenticated) {
      hasExchanged.current = true;
      getIdTokenClaims().then(async (claims) => {
        if (!claims?.__raw) {
          navigate('/login');
          return;
        }
        try {
          const response = await auth0SignIn(claims.__raw);
          login(response.data.accessToken);
          navigate('/');
        } catch (err: unknown) {
          console.error('[Auth0Callback] backend exchange failed:', err);
          navigate('/login');
        }
      });
    }
  }, [isAuthenticated, isLoading, error]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: 2 }}>
      <CircularProgress />
      <Typography color="text.secondary">Signing you in...</Typography>
    </Box>
  );
};

export default Auth0CallbackPage;
