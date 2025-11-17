import { useState, useEffect } from 'react';
import Modal from './Modal';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { useAuth } from '../contexts/AuthContext';
import { ticketService } from '../services/ticket.service';
import { mapApiTicketLogsToTicketLogs } from '../utils/mappers';
import type { Ticket, TicketLog } from '../types/ticket';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function TicketDetailModal({ ticket, isOpen, onClose, onUpdate }: TicketDetailModalProps) {
  const { user } = useAuth();
  const [showEscalateForm, setShowEscalateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');
  const [updateData, setUpdateData] = useState({
    resolution: '',
    resolutionNotes: '',
    action_status: 'attending' as 'attending' | 'completed',
    criticalValue: '' as '' | 'C1' | 'C2' | 'C3',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<TicketLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // Fetch ticket logs when modal opens
  useEffect(() => {
    const fetchLogs = async () => {
      if (!ticket || !isOpen) return;

      setIsLoadingLogs(true);
      try {
        const apiLogs = await ticketService.getTicketLogs(ticket.apiId);
        const mappedLogs = mapApiTicketLogsToTicketLogs(apiLogs);
        setLogs(mappedLogs);
      } catch (err) {
        console.error('Error fetching ticket logs:', err);
        setLogs([]);
      } finally {
        setIsLoadingLogs(false);
      }
    };

    fetchLogs();
  }, [ticket?.apiId, isOpen]);

  if (!ticket) return null;

  const canEscalate = () => {
    if (user?.role === 'L1' && ticket.escalationLevel === 'L1') return true;
    if (user?.role === 'L2' && ticket.escalationLevel === 'L2') return true;
    return false;
  };

  const getEscalateToLevel = () => {
    if (user?.role === 'L1' && ticket.escalationLevel === 'L1') return 'L2';
    if (user?.role === 'L2' && ticket.escalationLevel === 'L2') return 'L3';
    return null;
  };

  const handleEscalate = async () => {
    if (!escalateReason.trim()) {
      setError('Please provide a reason for escalation');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const escalateToLevel = getEscalateToLevel();
      if (escalateToLevel === 'L2') {
        await ticketService.escalateToL2(ticket.apiId, { reason: escalateReason });
      } else if (escalateToLevel === 'L3') {
        await ticketService.escalateToL3(ticket.apiId, { reason: escalateReason });
      }

      setEscalateReason('');
      setShowEscalateForm(false);
      onUpdate?.();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to escalate ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseEscalateForm = () => {
    setShowEscalateForm(false);
    setEscalateReason('');
    setError(null);
  };

  const canUpdate = () => {
    if (user?.role === 'L1' && ticket.escalationLevel === 'L1') return true;
    if (user?.role === 'L2' && ticket.escalationLevel === 'L2') return true;
    if (user?.role === 'L3' && ticket.escalationLevel === 'L3') return true;
    return false;
  };

  const handleUpdate = async () => {
    // Validation for L3
    if (user?.role === 'L3' && !updateData.resolution.trim()) {
      setError('Resolution is required for L3');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (user?.role === 'L1') {
        await ticketService.updateTicketL1(ticket.apiId, {
          resolutionNotes: updateData.resolutionNotes || undefined,
          action_status: updateData.action_status as any,
        });
      } else if (user?.role === 'L2') {
        await ticketService.updateTicketL2(ticket.apiId, {
          resolutionNotes: updateData.resolutionNotes || undefined,
          action_status: updateData.action_status as any,
          criticalValue: updateData.criticalValue || undefined,
        });
      } else if (user?.role === 'L3') {
        await ticketService.updateTicketL3(ticket.apiId, {
          resolution: updateData.resolution,
          resolutionNotes: updateData.resolutionNotes || undefined,
          action_status: updateData.action_status as any,
        });
      }

      setUpdateData({
        resolution: '',
        resolutionNotes: '',
        action_status: 'attending',
        criticalValue: '',
      });
      setShowUpdateForm(false);
      onUpdate?.();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenUpdateForm = () => {
    // Set default values from ticket when opening form
    setUpdateData({
      resolution: '',
      resolutionNotes: '',
      action_status: 'attending',
      criticalValue: ticket?.criticalValue || '',
    });
    setShowUpdateForm(true);
  };

  const handleCloseUpdateForm = () => {
    setShowUpdateForm(false);
    setUpdateData({
      resolution: '',
      resolutionNotes: '',
      action_status: 'attending',
      criticalValue: '',
    });
    setError(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={ticket.id} size="xl">
      <div className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                {ticket.category}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium">
                Level {ticket.escalationLevel}
              </span>
              {ticket.criticalValue && (
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  ticket.criticalValue === 'C1'
                    ? 'bg-red-100 text-red-800'
                    : ticket.criticalValue === 'C2'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {ticket.criticalValue}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{ticket.title}</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase">
                  Description
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">
                  Activity Log
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {isLoadingLogs ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : logs.length > 0 ? (
                    <div className="space-y-4">
                      {logs.map((log, index) => (
                        <div key={log.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {index + 1}
                            </div>
                            {index < logs.length - 1 && (
                              <div className="w-0.5 flex-1 bg-gray-300 mt-2"></div>
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <p className="font-medium text-gray-900">{log.action}</p>
                            <p className="text-sm text-gray-600 mt-1">by {log.user}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No activity logs yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Ticket Info */}
            <div className="space-y-6">
              {/* Details Card */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Category</p>
                    <span className="px-2 py-1 bg-white border border-gray-200 text-gray-700 rounded text-sm">
                      {ticket.category}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Escalation Level</p>
                    <p className="text-sm font-medium text-gray-900">{ticket.escalationLevel}</p>
                  </div>
                  {ticket.criticalValue && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Critical Value</p>
                      <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                        ticket.criticalValue === 'C1'
                          ? 'bg-red-100 text-red-800'
                          : ticket.criticalValue === 'C2'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ticket.criticalValue}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Assigned To</p>
                    <p className="text-sm font-medium text-gray-900">
                      {ticket.assignedTo || 'Unassigned'}
                    </p>
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
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">Actions</h3>

                {!showEscalateForm && !showUpdateForm ? (
                  <div className="space-y-3">
                    {canUpdate() && (
                      <button
                        onClick={handleOpenUpdateForm}
                        className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors text-sm"
                      >
                        Update Ticket
                      </button>
                    )}
                    {canEscalate() && (
                      <button
                        onClick={() => setShowEscalateForm(true)}
                        className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm"
                      >
                        Escalate to {getEscalateToLevel()}
                      </button>
                    )}
                  </div>
                ) : showEscalateForm ? (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Escalation Reason <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={escalateReason}
                        onChange={(e) => setEscalateReason(e.target.value)}
                        placeholder="Explain why this ticket needs to be escalated..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        disabled={isSubmitting}
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={handleEscalate}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Escalating...' : `Escalate to ${getEscalateToLevel()}`}
                      </button>
                      <button
                        onClick={handleCloseEscalateForm}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    {user?.role === 'L3' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Resolution <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={updateData.resolution}
                          onChange={(e) => setUpdateData({ ...updateData, resolution: e.target.value })}
                          placeholder="Describe the final resolution..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          disabled={isSubmitting}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resolution Notes
                      </label>
                      <textarea
                        value={updateData.resolutionNotes}
                        onChange={(e) => setUpdateData({ ...updateData, resolutionNotes: e.target.value })}
                        placeholder="Describe the action taken or progress..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={updateData.action_status}
                        onChange={(e) => setUpdateData({ ...updateData, action_status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isSubmitting}
                      >
                        <option value="attending">Attending</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    {user?.role === 'L2' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Critical Value (Optional)
                        </label>
                        <select
                          value={updateData.criticalValue}
                          onChange={(e) => setUpdateData({ ...updateData, criticalValue: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          disabled={isSubmitting}
                        >
                          <option value="">None</option>
                          <option value="C1">C1 - Critical</option>
                          <option value="C2">C2 - High</option>
                          <option value="C3">C3 - Medium</option>
                        </select>
                      </div>
                    )}

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdate}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Updating...' : 'Update'}
                      </button>
                      <button
                        onClick={handleCloseUpdateForm}
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
