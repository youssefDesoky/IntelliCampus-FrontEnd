import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import useDeviceType from '../hooks/useDeviceType';
import { CheckIcon, XIcon, WarningIcon, InfoIcon } from '../components/ui/icons';

const ToastContext = createContext();

let globalOnToast = null;

export function emitToast(toast) {
  if (globalOnToast) {
    globalOnToast(toast);
  }
}

export function useToast() {
  return useContext(ToastContext);
}

const typeStyles = {
  success: {
    icon: <CheckIcon />,
    bgClass: 'bg-bg-fill-success-default-light dark:bg-bg-fill-success-default-dark',
    borderClass: 'border-bg-fill-success-default-light dark:border-bg-fill-success-default-dark',
  },
  error: {
    icon: <XIcon />,
    bgClass: 'bg-bg-fill-danger-default-light dark:bg-bg-fill-danger-default-dark',
    borderClass: 'border-bg-fill-danger-default-light dark:border-bg-fill-danger-default-dark',
  },
  warning: {
    icon: <WarningIcon />,
    bgClass: 'bg-bg-fill-warning-default-light dark:bg-bg-fill-warning-default-dark',
    borderClass: 'border-bg-fill-warning-default-light dark:border-bg-fill-warning-default-dark',
  },
  info: {
    icon: <InfoIcon />,
    bgClass: 'bg-bg-fill-info-default-light dark:bg-bg-fill-info-default-dark',
    borderClass: 'border-bg-fill-info-default-light dark:border-bg-fill-info-default-dark',
  },
};

function ToastItem({ toast, onDismiss, isDesktop }) {
  const config = typeStyles[toast.type] || typeStyles.info;

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg shadow-lg pointer-events-auto
        bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark
        border-l-4 ${config.borderClass}
        ${isDesktop ? 'w-80 animate-slide-in-right' : 'max-w-sm w-full mx-auto animate-fade-in-down'}
      `}
      role="alert"
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${config.bgClass}`}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="font-semibold text-sm text-text-primary-active-light dark:text-text-primary-active-dark">
            {toast.title}
          </p>
        )}
        <p className="text-xs text-text-secondary-default-light dark:text-text-secondary-default-dark mt-0.5">
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-1 text-icon-secondary-default-light dark:text-icon-secondary-default-dark hover:text-icon-secondary-hover-light dark:hover:text-icon-secondary-hover-dark transition-colors"
      >
        <XIcon size={16} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const { isDesktop } = useDeviceType();
  const timersRef = useRef({});

  const showToast = useCallback(({ title, message, type = 'info', duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type, duration }]);

    if (duration > 0) {
      timersRef.current[id] = setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
        delete timersRef.current[id];
      }, duration);
    }

    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  useEffect(() => {
    globalOnToast = showToast;
    return () => { globalOnToast = null; };
  }, [showToast]);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className={`
          fixed z-[100] pointer-events-none
          ${isDesktop
            ? 'top-20 right-4 flex flex-col gap-3'
            : 'top-4 left-0 right-0 flex flex-col items-center gap-3 px-4'
          }
        `}
      >
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={dismissToast}
            isDesktop={isDesktop}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
