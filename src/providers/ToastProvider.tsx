import { Slide, ToastContainer } from 'react-toastify';
import { toastConfig } from './toast-config';

export const ToastProvider = () => {

  return ( 
    <div>
      <ToastContainer 
        {...toastConfig} 
        transition={Slide} 
        limit={1} 
        closeButton={false}
      />
    </div>
  );
};