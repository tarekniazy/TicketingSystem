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
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../api/authApi';

interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>();

  const password = watch('password');

  const onSubmit = async (data: SignupFormValues) => {
    setError('');
    setLoading(true);
    try {
      await signUp({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      navigate('/login');
    } catch {
      setError('Registration failed. Please check your details and try again.');
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
      <Card sx={{ width: 440, p: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="First Name"
                fullWidth
                margin="normal"
                {...register('firstName', {
                  required: 'First name is required',
                  maxLength: { value: 50, message: 'First name must be at most 50 characters' },
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
              <TextField
                label="Last Name"
                fullWidth
                margin="normal"
                {...register('lastName', {
                  required: 'Last name is required',
                  maxLength: { value: 50, message: 'Last name must be at most 50 characters' },
                })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Box>

            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
                maxLength: { value: 255, message: 'Email must be at most 255 characters' },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Password must be at least 8 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/,
                  message:
                    'Password must contain an uppercase letter, a lowercase letter, a number, and a special character',
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>

            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignupPage;
