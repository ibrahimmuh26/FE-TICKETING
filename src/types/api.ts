// Types sesuai dengan Backend API

export enum UserRole {
  L1 = 'L1',
  L2 = 'L2',
  L3 = 'L3'
}

export enum TicketStatus {
  NEW = 'new',
  ATTENDING = 'attending',
  ESCALATED = 'escalated',
  COMPLETED = 'completed',
  RESOLVED = 'resolved'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum Category {
  HARDWARE = 'Hardware',
  SOFTWARE = 'Software',
  NETWORK = 'Network',
  ACCOUNT = 'Account',
  OTHER = 'Other'
}

export enum CriticalValue {
  C1 = 'C1',
  C2 = 'C2',
  C3 = 'C3'
}

export enum ActionType {
  CREATED = 'created',
  ESCALATED = 'escalated',
  ACTION_TAKEN = 'action_taken',
  CRITICAL_ASSIGNED = 'critical_assigned',
  RESOLVED = 'resolved'
}

export interface ApiUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface ApiTicket {
  _id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: TicketStatus;
  currentLevel: 1 | 2 | 3;
  escalationLevel: 1 | 2 | 3;
  criticalValue?: CriticalValue;
  expectedCompletionDate: string;
  completedDate?: string;
  resolvedDate?: string;
  createdBy: ApiUser;
  assignedTo?: ApiUser;
  escalatedBy?: ApiUser;
  resolvedBy?: ApiUser;
  resolution?: string;
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiTicketLog {
  _id: string;
  ticketId: string;
  actionType: ActionType;
  previousValue?: string;
  newValue?: string;
  comment?: string;
  escalationReason?: string;
  performedBy: {
    username: string;
    email: string;
  };
  createdAt: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  category: Category;
  priority?: Priority;
  expectedCompletionDate: string;
}

export interface UpdateTicketL1Request {
  resolutionNotes?: string;
  action_status?: TicketStatus;
}

export interface UpdateTicketL2Request {
  resolutionNotes?: string;
  action_status?: TicketStatus;
  criticalValue?: CriticalValue;
}

export interface UpdateTicketL3Request {
  resolution: string;
  resolutionNotes?: string;
  action_status?: TicketStatus;
}

export interface EscalateRequest {
  reason?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
