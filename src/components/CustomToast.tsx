import { ToastContentProps } from 'react-toastify';
import { X, Check } from 'lucide-react';

export const CustomToast = ({ 
  title, 
  message, 
  closeToast,
  type = 'default'
}: ToastContentProps & { 
  title: string; 
  message: string;
  type?: 'default' | 'success';
}) => {
  return (
    <div className='flex flex-row justify-between items-center w-[280px] sm:w-[350px] md:w-[400px] lg:w-[450px]'>
      {type === 'success' &&
            <Check size={20} className="sm:w-6 sm:h-6 text-green-500" />
          }
      <div className="flex flex-col p-2 sm:p-3 md:p-4">
        <h3 className="text-white text-sm sm:text-lg font-bold">{title}</h3>
        <p className="text-sm sm:text-base text-white">{message}</p>
      </div>
      <div>
        <button 
          onClick={closeToast}
          className="p-1 sm:p-2"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>
      </div>
    </div>  
  );
};