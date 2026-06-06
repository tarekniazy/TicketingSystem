import axiosClient from './axiosClient';
import type { AuthResponse } from '../models/AuthResponse';
import type { LoginRequest } from '../models/LoginRequest';
import type { SignupRequest } from '../models/SignupRequest';

export const signIn = (data: LoginRequest) =>
  axiosClient.post<AuthResponse>('/auth/signin', data);

export const signUp = (data: SignupRequest) =>
  axiosClient.post('/auth/signup', data);

export const auth0SignIn = (idToken: string) =>
  axiosClient.post<AuthResponse>('/auth/auth0', { idToken });
