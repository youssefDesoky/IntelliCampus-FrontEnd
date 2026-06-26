import { emitError } from '../contexts/ErrorContext';
import { API_URL } from '../config/api';

export class ApiError extends Error {
  constructor(status, title, detail, body) {
    super(detail || title || `Request failed with status ${status}`);
    this.status = status;
    this.title = title;
    this.detail = detail;
    this.body = body;
  }
}

export default async function apiClient(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;

  const fetchOptions = {
    credentials: options.credentials ?? 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };

  if (options.body instanceof FormData) {
    delete fetchOptions.headers['Content-Type'];
  }

  const res = await fetch(url, fetchOptions);

  let body;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try { body = await res.json(); } catch { body = null; }
  } else if (res.status !== 204) {
    try { body = await res.text(); } catch { body = null; }
  }

  if (res.status === 204) return null;

  if (!res.ok) {
    const title = body?.title || 'Error';
    const detail = body?.detail || body?.message || body || `Request failed (${res.status})`;

    const error = new ApiError(res.status, title, detail, body);

    switch (res.status) {
      case 400:
        emitError({ title, message: detail });
        break;
      case 401:
        window.location.href = '/unauthorized';
        break;
      case 403:
        if (body?.type === 'must_change_password') {
          window.location.href = '/first-time-setup';
        } else {
          emitError({ title, message: detail });
        }
        break;
      case 404:
        emitError({ title, message: detail || 'Resource not found' });
        break;
      case 500:
        window.location.href = '/internal-server-error';
        break;
      default:
        emitError({ title, message: detail });
    }

    throw error;
  }

  return body;
}
