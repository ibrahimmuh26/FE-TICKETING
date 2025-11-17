import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import Modal from '../Modal';

describe('Modal', () => {
  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );

    const closeButton = screen.getByRole('button');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render different sizes', () => {
    const { container, rerender } = render(
      <Modal isOpen={true} onClose={() => {}} title="Test" size="sm">
        <div>Content</div>
      </Modal>
    );

    let modalContent = container.querySelector('.max-w-md');
    expect(modalContent).toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={() => {}} title="Test" size="xl">
        <div>Content</div>
      </Modal>
    );

    modalContent = container.querySelector('.max-w-6xl');
    expect(modalContent).toBeInTheDocument();
  });
});
