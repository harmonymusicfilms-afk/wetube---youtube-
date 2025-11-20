import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          bg-[#121212] border rounded-lg px-4 py-2.5 text-white transition-colors
          focus:outline-none focus:ring-1 focus:ring-wetube-red
          placeholder:text-gray-500
          ${error ? 'border-red-500 focus:border-red-500' : 'border-[#3F3F3F] focus:border-wetube-red'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-0.5">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;