import { Slide, ToastContainer } from 'react-toastify';
import { toastConfig } from './toast-config';

export const ToastProvider = () => {
  return <ToastContainer {...toastConfig} transition={Slide} limit={1} />;
};