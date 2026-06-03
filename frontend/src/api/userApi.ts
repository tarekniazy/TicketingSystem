import axiosClient from './axiosClient';
import { type User } from '../models/User';

export const getUsers = () =>
  axiosClient.get<User[]>('/users');
