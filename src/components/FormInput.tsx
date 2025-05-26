import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface FormInputProps {
  label: string;
  id: string;
  type: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  icon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  type,
  placeholder,
  register,
  error,
  icon,
  onChange,
  maxLength,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{icon}</span>
          </div>
        )}
        <input
          type={type}
          id={id}
          className={`block w-full ${
            icon ? 'pl-10' : 'pl-3'
          } pr-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={onChange}
          {...register(id, { onChange })}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormInput;