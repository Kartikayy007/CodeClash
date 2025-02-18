import React, { PropsWithChildren } from 'react';

interface LabelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: 'filled' | 'outlined' | 'light' | 'red';
  customSize?: {
    width?: string;
    height?: string;
  };
}

const LabelButton = ({ 
  children, 
  className, 
  variant = 'filled', 
  customSize,
  disabled,
  ...props 
}: PropsWithChildren<LabelButtonProps>) => {
  const variantStyles = {
    filled: `
      bg-[#C879EB]
      text-[20px]
      font-[550]
      hover:opacity-90
      transition-all
      duration-200
      ${disabled ? 'opacity-50 bg-[#8B8B8B] cursor-not-allowed' : ''}
    `,
    outlined: `
      border-2
      border-[#C879EB]
      bg-transparent
      text-[#C879EB]
      text-[20px]
      font-[600]
      hover:opacity-90
      transition-all
      duration-200
      ${disabled ? 'opacity-50 border-[#8B8B8B] text-[#8B8B8B] cursor-not-allowed' : ''}
    `,
    light: `
      text-[#000000]
      text-[20px]
      font-[550]
      bg-[#E3BBF7]
      hover:opacity-90
      transition-all
      duration-200
      ${disabled ? 'opacity-50 bg-[#8B8B8B] cursor-not-allowed' : ''}
    `,
    red: `
      bg-[#FF4D4D]
      text-[#000000]
      text-[20px]
      font-[550]
      hover:opacity-90
      transition-all
      duration-200
      ${disabled ? 'opacity-50 bg-[#8B8B8B] cursor-not-allowed' : ''}
    `
  };

  const sizeStyles = customSize ? `
    w-[${customSize.width}]
    h-[${customSize.height}]
  ` : `
    h-[45px]
  `;

  return (
    <button
      className={`
        w-full
        relative
        px-3 
        sm:px-4 
        py-2 
        rounded-md 
        text-base
        sm:text-lg
        ${sizeStyles}
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
      disabled={disabled}
      {...props}
    >
      <div
        className={`${variant === 'filled' ? 'text-black' : ''} ${className || ''}`}
        style={{
          textShadow: variant === 'filled' ? '1px 1px 4px rgba(0, 0, 0, 0.35)' : 'none'
        }}
      >
        {children}
      </div>
    </button>
  );
};

export default LabelButton;