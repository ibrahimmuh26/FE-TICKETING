import type { TicketPriority } from '../types/ticket';

interface PriorityBadgeProps {
  priority: TicketPriority;
}

const priorityConfig: Record<TicketPriority, { bg: string; text: string }> = {
  Low: { bg: 'bg-gray-100', text: 'text-gray-800' },
  Medium: { bg: 'bg-orange-100', text: 'text-orange-800' },
  High: { bg: 'bg-red-100', text: 'text-red-800' },
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {priority}
    </span>
  );
}
