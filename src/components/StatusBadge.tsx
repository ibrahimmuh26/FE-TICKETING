import type { TicketStatus } from '../types/ticket';

interface StatusBadgeProps {
  status: TicketStatus;
}

const statusConfig: Record<TicketStatus, { bg: string; text: string }> = {
  New: { bg: 'bg-blue-100', text: 'text-blue-800' },
  Attending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  Completed: { bg: 'bg-green-100', text: 'text-green-800' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {status}
    </span>
  );
}
