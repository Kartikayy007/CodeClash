import { toast as toastify, ToastOptions, Id } from 'react-toastify';

const TOAST_STYLES = {
  base: {
    color: '#fff',
    borderRadius: '8px',
    padding: '16px',
    fontSize: '16px',
    overflow: 'hidden',
    textAlign: 'center' as const
  },
  variants: {
    success: {
      border: '1px solid #10B981',
    },
    error: {
      border: '1px solid #EF4444',
    }
  }
} as const;

export const toastConfig: ToastOptions = {
  position: "top-right",
  className: 'toast-with-progress',
  style: TOAST_STYLES.base,
  progressClassName: "toast-progress",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

let activeToastId: Id | null = null;

const showToast = (type: 'success' | 'error', message: string) => {
  if (activeToastId) {
    toastify.dismiss(activeToastId);
  }
  activeToastId = toastify[type](message, toastConfig);
};

export const toast = {
  error: (message: string) => showToast('error', message),
  success: (message: string) => showToast('success', message),
} as const;