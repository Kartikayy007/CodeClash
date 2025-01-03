import { ToastContentProps } from 'react-toastify';

export const CustomToast = ({ 
  title, 
  message, 
  closeToast 
}: ToastContentProps & { 
  title: string; 
  message: string; 
}) => {
  return (
    <div className="grid grid-cols-[1fr_1px_80px] w-full">
      <div className="flex flex-col p-4">
        <h3 className="text-white text-lg font-bold">{title}</h3>
        <p className="text-base text-white">{message}</p>
      </div>
    </div>
  );
};