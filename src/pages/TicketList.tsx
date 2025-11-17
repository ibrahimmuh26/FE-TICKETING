import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import TicketDetailModal from '../components/TicketDetailModal';
import CreateTicketModal from '../components/CreateTicketModal';
import Pagination from '../components/Pagination';
import ExclamationIcon from '../components/icons/ExclamationIcon';
import { ticketService } from '../services/ticket.service';
import { mapApiTicketsToTickets } from '../utils/mappers';
import { useAuth } from '../contexts/AuthContext';
import type { TicketStatus, TicketPriority, Ticket } from '../types/ticket';
import type { PaginationMeta } from '../types/api';

export default function TicketList() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await ticketService.getTickets({ page: currentPage, limit });
        const mappedTickets = mapApiTicketsToTickets(response.data);
        setTickets(mappedTickets);
        setPagination(response.pagination);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load tickets. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [currentPage, limit]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1); // Reset to first page when limit changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const handleCreateSuccess = async () => {
    // Refresh tickets after successful creation
    try {
      setIsLoading(true);
      const response = await ticketService.getTickets({ page: currentPage, limit });
      const mappedTickets = mapApiTicketsToTickets(response.data);
      setTickets(mappedTickets);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Error refreshing tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter !== 'All' && ticket.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && ticket.priority !== priorityFilter) return false;
    if (searchQuery && !ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !ticket.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tickets...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <ExclamationIcon className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Tickets</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Tickets</h1>
            <p className="text-gray-600 mt-1">Manage and track all support tickets</p>
          </div>
          {user?.role === 'L1' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + Create Ticket
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-wrap gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <label className="block text-xs font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID or title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'All')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="All">All</option>
                <option value="New">New</option>
                <option value="Attending">Attending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | 'All')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="All">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Ticket Cards */}
        <div className="grid gap-4">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => handleTicketClick(ticket)}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-primary hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-primary">{ticket.id}</span>
                    <StatusBadge status={ticket.status} />
                    <PriorityBadge priority={ticket.priority} />
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {ticket.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{ticket.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
                </div>
                <div className="text-right text-sm space-y-1">
                  <p className="text-gray-600">
                    <span className="font-medium">Level:</span> {ticket.escalationLevel}
                  </p>
                  {ticket.assignedTo && (
                    <p className="text-gray-600">
                      <span className="font-medium">Assigned:</span> {ticket.assignedTo}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filteredTickets.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 py-16 text-center text-gray-500">
              <p className="text-lg">No tickets found</p>
              <p className="text-sm mt-2">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && filteredTickets.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200">
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              limit={limit}
              onLimitChange={handleLimitChange}
            />
          </div>
        )}
      </div>

      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={handleCreateSuccess}
      />

      {user?.role === 'L1' && (
        <CreateTicketModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </Layout>
  );
}
