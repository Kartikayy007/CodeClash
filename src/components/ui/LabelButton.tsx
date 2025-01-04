import React, { PropsWithChildren } from 'react';

interface LabelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: 'filled' | 'outlined' | 'light';
}

const LabelButton = ({ children, className, variant = 'filled', ...props }: PropsWithChildren<LabelButtonProps>) => {
  const variantStyles = {
    filled: `
      bg-[#C879EB]
      text-[20px]
      font-[550]`,
    outlined: `
      border-2
      border-[#C879EB]
      bg-transparent
      text-[#C879EB]
      text-[20px]
      font-[600]`,
    light: `
      bg-transparent
      text-[#000000]
      text-[20px]
      font-[550]
      bg-[#E3BBF7]`
  };

  return (
    <button
      className={`
        relative
        w-[400px]
        sm:w-[400px]
        md:w-[450px]
        lg:w-[500px]
        h-[55px]
        px-4 
        py-2 
        rounded-md 
        ${variantStyles[variant]}
        ${className || ''}
      `}
      style={{
        boxShadow: variant === 'filled' ? `
          0px 1px 12px 0px rgba(255, 255, 255, 0.1) inset,
          0px -1px 4px 0px rgba(0, 0, 0, 0.1) inset,
          0px 4px 8px 0px rgba(255, 255, 255, 0.1) inset
        ` : 'none'
      }}
      {...props}
    >
      <span
        className={variant === 'filled' ? 'text-black' : ''}
        style={{
          textShadow: variant === 'filled' ? '1px 1px 4px rgba(0, 0, 0, 0.35)' : 'none'
        }}
      >
        {children}
      </span>
    </button>
  );
};

export default LabelButton;