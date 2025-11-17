import { describe, it, expect } from 'vitest';
import {
  mapApiTicketToTicket,
  mapApiTicketsToTickets,
  mapApiTicketLogToTicketLog,
  mapApiTicketLogsToTicketLogs,
} from '../mappers';
import type { ApiTicket, ApiTicketLog } from '../../types/api';

describe('mappers', () => {
  describe('mapApiTicketToTicket', () => {
    it('should map API ticket to frontend ticket format', () => {
      const apiTicket: ApiTicket = {
        _id: '123abc',
        ticketNumber: 'TKT-001',
        title: 'Test Ticket',
        description: 'Test Description',
        category: 'Hardware',
        priority: 'high',
        status: 'new',
        currentLevel: 1,
        escalationLevel: 1,
        expectedCompletionDate: '2024-12-31T00:00:00.000Z',
        createdBy: {
          id: '456',
          username: 'user1',
          email: 'user@test.com',
          role: 'L1',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      const result = mapApiTicketToTicket(apiTicket);

      expect(result).toEqual({
        id: 'TKT-001',
        apiId: '123abc',
        title: 'Test Ticket',
        description: 'Test Description',
        category: 'Hardware',
        priority: 'High',
        status: 'New',
        escalationLevel: 'L1',
        criticalValue: undefined,
        createdAt: '2024-01-01T00:00:00.000Z',
        expectedDate: '2024-12-31T00:00:00.000Z',
        assignedTo: undefined,
        logs: [],
      });
    });

    it('should handle critical value', () => {
      const apiTicket: ApiTicket = {
        _id: '123',
        ticketNumber: 'TKT-002',
        title: 'Critical Ticket',
        description: 'Description',
        category: 'Software',
        priority: 'medium',
        status: 'attending',
        currentLevel: 2,
        escalationLevel: 2,
        criticalValue: 'C1',
        expectedCompletionDate: '2024-12-31T00:00:00.000Z',
        createdBy: {
          id: '456',
          username: 'user1',
          email: 'user@test.com',
          role: 'L1',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        assignedTo: {
          id: '789',
          username: 'admin1',
          email: 'admin@test.com',
          role: 'L2',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      const result = mapApiTicketToTicket(apiTicket);

      expect(result.criticalValue).toBe('C1');
      expect(result.assignedTo).toBe('admin1');
      expect(result.escalationLevel).toBe('L2');
    });
  });

  describe('mapApiTicketsToTickets', () => {
    it('should map multiple API tickets', () => {
      const apiTickets: ApiTicket[] = [
        {
          _id: '1',
          ticketNumber: 'TKT-001',
          title: 'Ticket 1',
          description: 'Desc 1',
          category: 'Hardware',
          priority: 'low',
          status: 'new',
          currentLevel: 1,
          escalationLevel: 1,
          expectedCompletionDate: '2024-12-31T00:00:00.000Z',
          createdBy: {
            id: '456',
            username: 'user1',
            email: 'user@test.com',
            role: 'L1',
            createdAt: '2024-01-01T00:00:00.000Z',
          },
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          _id: '2',
          ticketNumber: 'TKT-002',
          title: 'Ticket 2',
          description: 'Desc 2',
          category: 'Software',
          priority: 'high',
          status: 'completed',
          currentLevel: 3,
          escalationLevel: 3,
          expectedCompletionDate: '2024-12-31T00:00:00.000Z',
          createdBy: {
            id: '456',
            username: 'user1',
            email: 'user@test.com',
            role: 'L1',
            createdAt: '2024-01-01T00:00:00.000Z',
          },
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      const result = mapApiTicketsToTickets(apiTickets);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('TKT-001');
      expect(result[1].id).toBe('TKT-002');
    });
  });

  describe('mapApiTicketLogToTicketLog', () => {
    it('should map created action', () => {
      const apiLog: ApiTicketLog = {
        _id: 'log1',
        ticketId: '123',
        actionType: 'created',
        performedBy: {
          username: 'user1',
          email: 'user@test.com',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      const result = mapApiTicketLogToTicketLog(apiLog);

      expect(result).toEqual({
        id: 'log1',
        action: 'Ticket created',
        timestamp: '2024-01-01T00:00:00.000Z',
        user: 'user1',
      });
    });

    it('should map escalated action with reason', () => {
      const apiLog: ApiTicketLog = {
        _id: 'log2',
        ticketId: '123',
        actionType: 'escalated',
        escalationReason: 'Requires network access',
        performedBy: {
          username: 'admin1',
          email: 'admin@test.com',
        },
        createdAt: '2024-01-02T00:00:00.000Z',
      };

      const result = mapApiTicketLogToTicketLog(apiLog);

      expect(result.action).toBe('Escalated: Requires network access');
      expect(result.user).toBe('admin1');
    });
  });

  describe('mapApiTicketLogsToTicketLogs', () => {
    it('should map multiple logs', () => {
      const apiLogs: ApiTicketLog[] = [
        {
          _id: 'log1',
          ticketId: '123',
          actionType: 'created',
          performedBy: {
            username: 'user1',
            email: 'user@test.com',
          },
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          _id: 'log2',
          ticketId: '123',
          actionType: 'resolved',
          performedBy: {
            username: 'admin1',
            email: 'admin@test.com',
          },
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ];

      const result = mapApiTicketLogsToTicketLogs(apiLogs);

      expect(result).toHaveLength(2);
      expect(result[0].action).toBe('Ticket created');
      expect(result[1].action).toBe('Ticket resolved');
    });
  });
});
