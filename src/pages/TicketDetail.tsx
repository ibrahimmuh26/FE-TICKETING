import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import { mockTickets } from '../data/mockTickets';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticket = mockTickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ticket not found</h2>
          <button
            onClick={() => navigate('/tickets')}
            className="text-primary hover:underline"
          >
            Back to tickets
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <button
              onClick={() => navigate('/tickets')}
              className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 text-sm"
            >
              ← Back to tickets
            </button>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl font-bold text-gray-900">{ticket.id}</h1>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h2 className="text-xl text-gray-700">{ticket.title}</h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-6 uppercase">Activity Log</h3>
              <div className="space-y-4">
                {ticket.logs.map((log, index) => (
                  <div key={log.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {index + 1}
                      </div>
                      {index < ticket.logs.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-medium text-gray-900">{log.action}</p>
                      <p className="text-sm text-gray-600 mt-1">by {log.user}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Ticket Info */}
          <div className="space-y-6">
            {/* Details Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {ticket.category}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Escalation Level</p>
                  <p className="text-sm font-medium text-gray-900">{ticket.escalationLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Assigned To</p>
                  <p className="text-sm font-medium text-gray-900">{ticket.assignedTo || 'Unassigned'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Created</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Expected Resolution</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(ticket.expectedDate).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors">
                  Update Status
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors">
                  Escalate Ticket
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors">
                  Reassign
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors">
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
