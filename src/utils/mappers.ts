import type { ApiTicket, ApiTicketLog, TicketStatus as ApiTicketStatus } from '../types/api';
import type { Ticket, TicketLog, TicketStatus } from '../types/ticket';

// Map API status to frontend status
const mapStatus = (status: ApiTicketStatus): TicketStatus => {
  const statusMap: Record<ApiTicketStatus, TicketStatus> = {
    new: 'New',
    attending: 'Attending',
    escalated: 'Attending', // Map escalated to Attending for frontend display
    completed: 'Completed',
    resolved: 'Completed', // Map resolved to Completed for frontend display
  };
  return statusMap[status] || 'New';
};

// Convert API ticket to frontend ticket format
export const mapApiTicketToTicket = (apiTicket: ApiTicket): Ticket => {
  return {
    id: apiTicket.ticketNumber, // Use ticketNumber as display ID
    apiId: apiTicket._id, // MongoDB _id for API calls
    title: apiTicket.title,
    description: apiTicket.description,
    category: apiTicket.category as 'Hardware' | 'Software' | 'Network' | 'Access' | 'Other',
    priority: apiTicket.priority.charAt(0).toUpperCase() + apiTicket.priority.slice(1) as 'Low' | 'Medium' | 'High',
    status: mapStatus(apiTicket.status),
    escalationLevel: `L${apiTicket.escalationLevel}` as 'L1' | 'L2' | 'L3',
    criticalValue: apiTicket.criticalValue,
    createdAt: apiTicket.createdAt,
    expectedDate: apiTicket.expectedCompletionDate,
    assignedTo: apiTicket.assignedTo?.username,
    logs: [], // Will be populated separately if needed
  };
};

// Convert API ticket log to frontend ticket log format
export const mapApiTicketLogToTicketLog = (apiLog: ApiTicketLog): TicketLog => {
  // Map action type to readable action
  const actionMap: Record<string, string> = {
    created: 'Ticket created',
    escalated: apiLog.escalationReason ? `Escalated: ${apiLog.escalationReason}` : 'Ticket escalated',
    action_taken: apiLog.comment || 'Action taken',
    critical_assigned: `Critical value assigned: ${apiLog.newValue}`,
    resolved: 'Ticket resolved',
  };

  return {
    id: apiLog._id,
    action: actionMap[apiLog.actionType] || apiLog.actionType,
    timestamp: apiLog.createdAt,
    user: apiLog.performedBy.username,
  };
};

// Convert multiple API tickets to frontend tickets
export const mapApiTicketsToTickets = (apiTickets: ApiTicket[]): Ticket[] => {
  return apiTickets.map(mapApiTicketToTicket);
};

// Convert multiple API logs to frontend logs
export const mapApiTicketLogsToTicketLogs = (apiLogs: ApiTicketLog[]): TicketLog[] => {
  return apiLogs.map(mapApiTicketLogToTicketLog);
};
