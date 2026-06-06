import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { signIn } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';
import type { LoginRequest } from '../models/LoginRequest';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    setError('');
    setLoading(true);
    try {
      const response = await signIn(data);
      login(response.data.accessToken);
      navigate('/');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'grey.100',
      }}
    >
      <Card sx={{ width: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            variant="outlined"
            fullWidth
            startIcon={<LockOutlinedIcon />}
            onClick={() =>
              loginWithRedirect({ appState: { returnTo: '/auth/callback' } })
            }
            sx={{ mb: 2 }}
          >
            Continue with SSO
          </Button>

          <Divider sx={{ mb: 2 }}>or</Divider>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>

            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
              Don&apos;t have an account?{' '}
              <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
