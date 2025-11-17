import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import TicketDetailModal from '../components/TicketDetailModal';
import CreateTicketModal from '../components/CreateTicketModal';
import Pagination from '../components/Pagination';
import { ticketService } from '../services/ticket.service';
import { mapApiTicketsToTickets } from '../utils/mappers';
import { useAuth } from '../contexts/AuthContext';
import type { TicketStatus, TicketPriority, EscalationLevel, Ticket } from '../types/ticket';
import type { PaginationMeta } from '../types/api';
import InboxIcon from '../components/icons/InboxIcon';
import CogIcon from '../components/icons/CogIcon';
import CheckCircleIcon from '../components/icons/CheckCircleIcon';
import ArrowUpIcon from '../components/icons/ArrowUpIcon';
import ExclamationIcon from '../components/icons/ExclamationIcon';

export default function Dashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'All'>('All');
  const [escalationFilter, setEscalationFilter] = useState<EscalationLevel | 'All'>('All');
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

  // Calculate statistics
  const stats = {
    new: tickets.filter((t) => t.status === 'New').length,
    attending: tickets.filter((t) => t.status === 'Attending').length,
    completed: tickets.filter((t) => t.status === 'Completed').length,
    escalated: tickets.filter((t) => t.escalationLevel !== 'L1').length,
  };

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    if (statusFilter !== 'All' && ticket.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && ticket.priority !== priorityFilter) return false;
    if (escalationFilter !== 'All' && ticket.escalationLevel !== escalationFilter) return false;
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Overview of your Ticketing tickets</p>
          </div>
          {user?.role === 'L1' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base whitespace-nowrap"
            >
              + Create Ticket
            </button>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="New Tickets"
            value={stats.new}
            icon={<InboxIcon className="text-blue-600" />}
            color="bg-blue-50"
          />
          <StatCard
            title="Attending"
            value={stats.attending}
            icon={<CogIcon className="text-yellow-600" />}
            color="bg-yellow-50"
          />
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircleIcon className="text-green-600" />}
            color="bg-green-50"
          />
          <StatCard
            title="Escalated"
            value={stats.escalated}
            icon={<ArrowUpIcon className="text-red-600" />}
            color="bg-red-50"
          />
        </div>

        {/* Filters & Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-3 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4">
              {/* Search */}
              <div className="flex-1 sm:min-w-64">
                <label className="block text-xs font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID or title..."
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Status Filter */}
              <div className="flex-1 sm:flex-none">
                <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'All')}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="All">All</option>
                  <option value="New">New</option>
                  <option value="Attending">Attending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="flex-1 sm:flex-none">
                <label className="block text-xs font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | 'All')}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="All">All</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Escalation Filter */}
              <div className="flex-1 sm:flex-none">
                <label className="block text-xs font-medium text-gray-700 mb-2">Escalation</label>
                <select
                  value={escalationFilter}
                  onChange={(e) => setEscalationFilter(e.target.value as EscalationLevel | 'All')}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="All">All</option>
                  <option value="L1">L1</option>
                  <option value="L2">L2</option>
                  <option value="L3">L3</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">ID</th>
                    <th className="px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">Title</th>
                    <th className="hidden sm:table-cell px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">Status</th>
                    <th className="hidden md:table-cell px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">Priority</th>
                    <th className="hidden lg:table-cell px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">Category</th>
                    <th className="hidden lg:table-cell px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">Level</th>
                    <th className="hidden xl:table-cell px-2 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap">Assigned To</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      onClick={() => handleTicketClick(ticket)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="text-primary font-medium hover:underline text-xs">
                          {ticket.id}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
                        <div className="text-xs text-gray-900 max-w-[120px] sm:max-w-xs truncate">
                          {ticket.title}
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <StatusBadge status={ticket.status} />
                      </td>
                      <td className="hidden md:table-cell px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="hidden lg:table-cell px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {ticket.category}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="text-xs font-medium text-gray-900">{ticket.escalationLevel}</span>
                      </td>
                      <td className="hidden xl:table-cell px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs text-gray-600">
                        {ticket.assignedTo || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTickets.length === 0 && (
                <div className="text-center py-8 sm:py-12 text-gray-500 text-sm">
                  <p>No tickets found matching your filters</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {pagination && filteredTickets.length > 0 && (
            <Pagination
              pagination={pagination}
              onPageChange={handlePageChange}
              limit={limit}
              onLimitChange={handleLimitChange}
            />
          )}
        </div>
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
