import React from 'react';
import { Loader2 } from './Icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  icon,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "rounded-lg font-medium transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-wetube-dark focus:ring-wetube-red disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-wetube-red text-white hover:bg-red-600",
    secondary: "bg-[#222] text-white hover:bg-[#3F3F3F]",
    ghost: "bg-transparent text-gray-300 hover:bg-[#3F3F3F] hover:text-white",
    danger: "bg-red-900/20 text-red-500 hover:bg-red-900/40"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;