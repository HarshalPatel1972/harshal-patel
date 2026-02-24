import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Contact } from './Contact'

// Mock framer-motion to avoid animation issues in tests
// Use a Proxy to mock all motion components (motion.div, motion.section, etc.)
const MockMotionComponent = ({ children, initial, whileInView, viewport, transition, ...props }: any) => <div {...props}>{children}</div>;

jest.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: () => MockMotionComponent
  }),
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Contact Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders the contact form correctly', () => {
    render(<Contact />);

    // Check for header
    expect(screen.getByText(/INITIATE_CONTACT/i)).toBeInTheDocument();

    // Check for inputs
    expect(screen.getByPlaceholderText('ENTER_ID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ENTER_EMAIL')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('INPUT_MESSAGE_DATA...')).toBeInTheDocument();

    // Check for submit button
    const submitButton = screen.getByRole('button', { name: /TRANSMIT_DATA/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  it('handles form submission and state transitions', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Contact />);

    const nameInput = screen.getByPlaceholderText('ENTER_ID');
    const emailInput = screen.getByPlaceholderText('ENTER_EMAIL');
    const messageInput = screen.getByPlaceholderText('INPUT_MESSAGE_DATA...');
    const submitButton = screen.getByRole('button', { name: /TRANSMIT_DATA/i });

    // Fill out the form
    // Note: userEvent calls are async
    await user.type(nameInput, 'Test User');
    await user.type(emailInput, 'test@example.com');
    await user.type(messageInput, 'Hello World');

    // Submit the form
    await user.click(submitButton);

    // Check for transmitting state
    expect(screen.getByText('TRANSMITTING...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Fast-forward timer to simulate API call completion
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Check for sent state
    await waitFor(() => {
      expect(screen.getByText('TRANSMISSION_COMPLETE')).toBeInTheDocument();
    });

    // Verify button remains disabled (as per code: disabled={status !== 'idle'})
    expect(submitButton).toBeDisabled();
  });
});
