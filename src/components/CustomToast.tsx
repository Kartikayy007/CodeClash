import { ToastContentProps } from 'react-toastify';
import {X} from 'lucide-react'

export const CustomToast = ({ 
  title, 
  message, 
  closeToast 
}: ToastContentProps & { 
  title: string; 
  message: string; 
}) => {
  return (
    <div className='flex flex-row justify-between items-center w-[450px]'>
      <div className="flex flex-col p-4">
        <h3 className="text-white text-lg font-bold">{title}</h3>
        <p className="text-base text-white">{message}</p>
      </div>
      <div>
        <button onClick={closeToast}>
          <X size={24} />
        </button>
      </div>
    </div>  
  );
};