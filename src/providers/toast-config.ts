import { toast as toastify } from 'react-toastify';
import { ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/toastify.css'; 
import { CustomToast } from '@/components/CustomToast';

const TOAST_STYLES = {
  base: {
    color: '#fff',
    paddingRight: '154px',
    fontSize: '14px',
    maxWidth: '90vw' as const,
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

export const toast = {
  error: (title: string, message: string) => 
    toastify((props) => CustomToast({ ...props, title, message }), toastConfig),
  success: (title: string, message: string) => 
    toastify((props) => CustomToast({ ...props, title, message }), {
      ...toastConfig,
      className: `${toastConfig.className} border-[#10B981]`
    }),
};