export type TicketStatus = 'New' | 'Attending' | 'Completed';
export type TicketPriority = 'Low' | 'Medium' | 'High';
export type TicketCategory = 'Hardware' | 'Software' | 'Network' | 'Access' | 'Other';
export type EscalationLevel = 'L1' | 'L2' | 'L3';

export interface Ticket {
  id: string; // ticketNumber for display
  apiId: string; // _id for API calls
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  escalationLevel: EscalationLevel;
  criticalValue?: 'C1' | 'C2' | 'C3';
  createdAt: string;
  expectedDate: string;
  assignedTo?: string;
  logs: TicketLog[];
}

export interface TicketLog {
  id: string;
  action: string;
  timestamp: string;
  user: string;
}

export interface DashboardStats {
  new: number;
  attending: number;
  completed: number;
  escalated: number;
}
