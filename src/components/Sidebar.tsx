import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import ChartBarIcon from './icons/ChartBarIcon';
import TicketIcon from './icons/TicketIcon';
import PlusIcon from './icons/PlusIcon';

interface MenuItem {
  path: string;
  label: string;
  icon: ReactNode;
}

const menuItems: MenuItem[] = [
  { path: '/', label: 'Dashboard', icon: <ChartBarIcon /> },
  { path: '/tickets', label: 'Tickets', icon: <TicketIcon /> },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-primary">HelpDesk</h1>
      </div>

      <nav className="px-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
