import { useState, useRef } from 'react';
import { useToast } from '../../contexts/ToastContext.jsx';

const DUMMY_MESSAGES = [
  { title: 'Success', message: 'Operation completed successfully!', type: 'success' },
  { title: 'Error', message: 'Something went wrong. Please try again.', type: 'error' },
  { title: 'Warning', message: 'Your session will expire in 5 minutes.', type: 'warning' },
  { title: 'Info', message: 'New updates are available for your courses.', type: 'info' },
  { title: 'Reminder', message: 'You have an assignment due tomorrow.', type: 'warning' },
  { title: 'Grade Posted', message: 'Your Math 101 grade has been posted.', type: 'success' },
  { title: 'Connection Lost', message: 'Unable to reach the server.', type: 'error' },
  { title: 'Tip', message: 'You can use keyboard shortcuts to navigate faster.', type: 'info' },
];

export default function ToastTester() {
  const [active, setActive] = useState(false);
  const intervalRef = useRef(null);
  const { showToast } = useToast();

  const toggle = () => {
    if (active) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setActive(false);
    } else {
      showToast({ title: 'Toast Tester', message: 'Dummy toasts every 60s started', type: 'info', duration: 3000 });
      const interval = setInterval(() => {
        const { title, message, type } = DUMMY_MESSAGES[Math.floor(Math.random() * DUMMY_MESSAGES.length)];
        showToast({ title, message, type, duration: 0 });
      }, 60_000);
      intervalRef.current = interval;
      setActive(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`
        fixed bottom-4 right-4 z-[200] px-4 py-2 rounded-lg shadow-lg text-sm font-medium
        transition-all duration-200
        ${active
          ? 'bg-bg-fill-danger-default-light dark:bg-bg-fill-danger-default-dark text-white'
          : 'bg-bg-fill-info-default-light dark:bg-bg-fill-info-default-dark text-white'
        }
      `}
    >
      {active ? 'Stop Dummy Toasts' : 'Start Dummy Toasts'}
    </button>
  );
}
