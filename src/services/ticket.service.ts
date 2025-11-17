import apiClient from './api';
import type {
  ApiTicket,
  ApiTicketLog,
  CreateTicketRequest,
  UpdateTicketL1Request,
  UpdateTicketL2Request,
  UpdateTicketL3Request,
  EscalateRequest,
  PaginatedResponse,
  PaginationParams,
} from '../types/api';

export const ticketService = {
  // Get all tickets with pagination
  getTickets: async (params?: PaginationParams): Promise<PaginatedResponse<ApiTicket>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = queryParams.toString() ? `/tickets?${queryParams}` : '/tickets';
    const response = await apiClient.get<PaginatedResponse<ApiTicket>>(url);
    return response.data;
  },

  // Get tickets by level
  getTicketsByLevel: async (level: 1 | 2 | 3): Promise<ApiTicket[]> => {
    const response = await apiClient.get<ApiTicket[]>(`/tickets/level/${level}`);
    return response.data;
  },

  // Get ticket detail
  getTicket: async (id: string): Promise<ApiTicket> => {
    const response = await apiClient.get<ApiTicket>(`/tickets/${id}`);
    return response.data;
  },

  // Get ticket logs
  getTicketLogs: async (id: string): Promise<ApiTicketLog[]> => {
    const response = await apiClient.get<ApiTicketLog[]>(`/tickets/${id}/logs`);
    return response.data;
  },

  // Create ticket (L1 only)
  createTicket: async (data: CreateTicketRequest): Promise<ApiTicket> => {
    const response = await apiClient.post<ApiTicket>('/tickets', data);
    return response.data;
  },

  // Update ticket L1
  updateTicketL1: async (id: string, data: UpdateTicketL1Request): Promise<ApiTicket> => {
    const response = await apiClient.post<ApiTicket>(`/tickets/${id}/update-l1`, data);
    return response.data;
  },

  // Update ticket L2
  updateTicketL2: async (id: string, data: UpdateTicketL2Request): Promise<ApiTicket> => {
    const response = await apiClient.post<ApiTicket>(`/tickets/${id}/update-l2`, data);
    return response.data;
  },

  // Update ticket L3
  updateTicketL3: async (id: string, data: UpdateTicketL3Request): Promise<ApiTicket> => {
    const response = await apiClient.post<ApiTicket>(`/tickets/${id}/update-l3`, data);
    return response.data;
  },

  // Escalate to L2
  escalateToL2: async (id: string, data?: EscalateRequest): Promise<ApiTicket> => {
    const response = await apiClient.post<ApiTicket>(`/tickets/${id}/escalate-l2`, data);
    return response.data;
  },

  // Escalate to L3
  escalateToL3: async (id: string, data?: EscalateRequest): Promise<ApiTicket> => {
    const response = await apiClient.post<ApiTicket>(`/tickets/${id}/escalate-l3`, data);
    return response.data;
  },

  // Resolve ticket (L3 only)
  resolveTicket: async (id: string): Promise<ApiTicket> => {
    const response = await apiClient.post<ApiTicket>(`/tickets/${id}/resolve`);
    return response.data;
  },
};
