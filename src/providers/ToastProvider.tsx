'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastConfig } from './toast-config';

export const ToastProvider = () => {
  return <ToastContainer {...toastConfig} />;
};