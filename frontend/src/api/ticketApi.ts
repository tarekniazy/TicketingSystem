import axiosClient from './axiosClient';
import { type Ticket, TicketCategory, TicketPriority, TicketStatus } from '../models/Ticket';

export interface CreateTicketRequest {
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
}

export interface UpdateTicketRequest {
  ticketId: string;
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
}

export interface UpdateTicketStatusRequest {
  ticketId: string;
  status: TicketStatus;
}

export interface AssignTicketRequest {
  ticketId: string;
  userId: string;
}

export const getAllTickets = () =>
  axiosClient.get<Ticket[]>('/tickets');

export const getTicketsForUser = (userId: string) =>
  axiosClient.get<Ticket[]>(`/tickets/${userId}`);

export const createTicket = (data: CreateTicketRequest) =>
  axiosClient.post('/tickets', data);

export const updateTicket = (id: string, data: UpdateTicketRequest) =>
  axiosClient.put(`/tickets/${id}`, data);

export const updateTicketStatus = (id: string, data: UpdateTicketStatusRequest) =>
  axiosClient.put(`/tickets/${id}/status`, data);

export const assignTicket = (id: string, data: AssignTicketRequest) =>
  axiosClient.put(`/tickets/${id}/assign`, data);

export const deleteTicket = (id: string) =>
  axiosClient.delete(`/tickets/${id}`);
