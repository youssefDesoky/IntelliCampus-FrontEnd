import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Dialog from '../components/ui/Dialog';

const ErrorContext = createContext();

let globalOnError = null;

// eslint-disable-next-line react-refresh/only-export-components
export function emitError(error) {
  if (globalOnError) {
    globalOnError(error);
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export function useError() {
  return useContext(ErrorContext);
}

export function ErrorProvider({ children }) {
  const [error, setError] = useState(null);

  const showError = useCallback((error) => {
    if (typeof error === 'string') {
      setError({ title: 'Error', message: error || 'An unexpected error occurred.' });
    } else if (error && typeof error === 'object') {
      setError({
        title: error.title || 'Error',
        message: error.message || error.detail || 'An unexpected error occurred.',
      });
    } else {
      setError({ title: 'Error', message: 'An unexpected error occurred.' });
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    globalOnError = showError;
    return () => { globalOnError = null; };
  }, [showError]);

  return (
    <ErrorContext.Provider value={{ showError }}>
      {children}
      <Dialog
        isOpen={!!error}
        variant="error"
        title={error?.title}
        onClose={clearError}
      >
        {error?.message}
      </Dialog>
    </ErrorContext.Provider>
  );
}
