import { describe, it, expect } from 'vitest';
import { render, screen } from '../../tests/utils/test-utils';
import PriorityBadge from '../PriorityBadge';

describe('PriorityBadge', () => {
  it('should render Low priority with correct styles', () => {
    render(<PriorityBadge priority="Low" />);
    const badge = screen.getByText('Low');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('should render Medium priority with correct styles', () => {
    render(<PriorityBadge priority="Medium" />);
    const badge = screen.getByText('Medium');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-orange-100', 'text-orange-800');
  });

  it('should render High priority with correct styles', () => {
    render(<PriorityBadge priority="High" />);
    const badge = screen.getByText('High');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100', 'text-red-800');
  });
});
