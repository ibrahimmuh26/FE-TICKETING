import type { Ticket } from '../types/ticket';

export const mockTickets: Ticket[] = [
  {
    id: 'TK-001',
    title: 'Laptop not turning on',
    description: 'My laptop won\'t boot up after the latest Windows update. Screen stays black.',
    category: 'Hardware',
    priority: 'High',
    status: 'New',
    escalationLevel: 'L1',
    createdAt: '2024-11-15T08:30:00Z',
    expectedDate: '2024-11-16T17:00:00Z',
    assignedTo: 'John Doe',
    logs: [
      {
        id: 'LOG-001',
        action: 'Ticket created',
        timestamp: '2024-11-15T08:30:00Z',
        user: 'Sarah Johnson'
      }
    ]
  },
  {
    id: 'TK-002',
    title: 'Cannot access shared drive',
    description: 'Getting permission denied error when trying to access the finance shared folder.',
    category: 'Access',
    priority: 'Medium',
    status: 'Attending',
    escalationLevel: 'L1',
    createdAt: '2024-11-14T14:20:00Z',
    expectedDate: '2024-11-15T17:00:00Z',
    assignedTo: 'Mike Chen',
    logs: [
      {
        id: 'LOG-002',
        action: 'Ticket created',
        timestamp: '2024-11-14T14:20:00Z',
        user: 'Robert Smith'
      },
      {
        id: 'LOG-003',
        action: 'Assigned to Mike Chen',
        timestamp: '2024-11-14T14:25:00Z',
        user: 'System'
      },
      {
        id: 'LOG-004',
        action: 'Status changed to Attending',
        timestamp: '2024-11-14T15:00:00Z',
        user: 'Mike Chen'
      }
    ]
  },
  {
    id: 'TK-003',
    title: 'Email not syncing on mobile',
    description: 'Outlook app on iPhone not receiving new emails for the past 2 hours.',
    category: 'Software',
    priority: 'Low',
    status: 'Completed',
    escalationLevel: 'L1',
    createdAt: '2024-11-13T09:15:00Z',
    expectedDate: '2024-11-14T17:00:00Z',
    assignedTo: 'Jane Williams',
    logs: [
      {
        id: 'LOG-005',
        action: 'Ticket created',
        timestamp: '2024-11-13T09:15:00Z',
        user: 'Emily Davis'
      },
      {
        id: 'LOG-006',
        action: 'Assigned to Jane Williams',
        timestamp: '2024-11-13T09:20:00Z',
        user: 'System'
      },
      {
        id: 'LOG-007',
        action: 'Status changed to Attending',
        timestamp: '2024-11-13T10:00:00Z',
        user: 'Jane Williams'
      },
      {
        id: 'LOG-008',
        action: 'Status changed to Completed',
        timestamp: '2024-11-13T11:30:00Z',
        user: 'Jane Williams'
      }
    ]
  },
  {
    id: 'TK-004',
    title: 'Network connection intermittent',
    description: 'WiFi keeps disconnecting every 10-15 minutes in the 3rd floor conference room.',
    category: 'Network',
    priority: 'High',
    status: 'Attending',
    escalationLevel: 'L2',
    createdAt: '2024-11-15T11:00:00Z',
    expectedDate: '2024-11-16T17:00:00Z',
    assignedTo: 'Alex Kumar',
    logs: [
      {
        id: 'LOG-009',
        action: 'Ticket created',
        timestamp: '2024-11-15T11:00:00Z',
        user: 'Michael Brown'
      },
      {
        id: 'LOG-010',
        action: 'Escalated to L2',
        timestamp: '2024-11-15T11:30:00Z',
        user: 'John Doe'
      },
      {
        id: 'LOG-011',
        action: 'Assigned to Alex Kumar',
        timestamp: '2024-11-15T11:35:00Z',
        user: 'System'
      }
    ]
  },
  {
    id: 'TK-005',
    title: 'Printer showing offline',
    description: 'Main office printer (HP LaserJet Pro) showing as offline on all computers.',
    category: 'Hardware',
    priority: 'Medium',
    status: 'New',
    escalationLevel: 'L1',
    createdAt: '2024-11-15T13:45:00Z',
    expectedDate: '2024-11-16T17:00:00Z',
    logs: [
      {
        id: 'LOG-012',
        action: 'Ticket created',
        timestamp: '2024-11-15T13:45:00Z',
        user: 'Lisa Anderson'
      }
    ]
  }
];
