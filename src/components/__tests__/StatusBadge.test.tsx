import { describe, it, expect } from 'vitest';
import { render, screen } from '../../tests/utils/test-utils';
import StatusBadge from '../StatusBadge';

describe('StatusBadge', () => {
  it('should render New status with correct styles', () => {
    render(<StatusBadge status="New" />);
    const badge = screen.getByText('New');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('should render Attending status with correct styles', () => {
    render(<StatusBadge status="Attending" />);
    const badge = screen.getByText('Attending');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('should render Completed status with correct styles', () => {
    render(<StatusBadge status="Completed" />);
    const badge = screen.getByText('Completed');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100', 'text-green-800');
  });
});
