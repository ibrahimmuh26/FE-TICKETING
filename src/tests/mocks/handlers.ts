import { http, HttpResponse } from 'msw';

const BASE_URL = 'http://localhost:8021';

export const handlers = [
  // Auth endpoints
  http.post(`${BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as any;

    if (body.email === 'admin@gmail.com' && body.password === 'password') {
      return HttpResponse.json({
        user: {
          id: '123',
          email: 'admin@gmail.com',
          username: 'admin1',
          role: 'L3',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        token: 'mock-jwt-token',
      });
    }

    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // Tickets endpoints
  http.get(`${BASE_URL}/tickets`, () => {
    return HttpResponse.json({
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
  }),

  http.post(`${BASE_URL}/tickets`, () => {
    return HttpResponse.json({
      _id: '123',
      ticketNumber: 'TKT-001',
      title: 'Test Ticket',
      description: 'Test Description',
      category: 'Hardware',
      priority: 'medium',
      status: 'new',
      currentLevel: 1,
      escalationLevel: 1,
      expectedCompletionDate: '2024-12-31T00:00:00.000Z',
      createdBy: {
        id: '123',
        username: 'user1',
        email: 'user@test.com',
        role: 'L1',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    });
  }),

  http.get(`${BASE_URL}/tickets/:id/logs`, () => {
    return HttpResponse.json([
      {
        _id: 'log1',
        ticketId: '123',
        actionType: 'created',
        performedBy: {
          username: 'admin1',
          email: 'admin@test.com',
        },
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    ]);
  }),
];
