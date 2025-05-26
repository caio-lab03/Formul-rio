import React from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  id: string;
  control: Control<any>;
  options: Option[];
  placeholder?: string;
  error?: FieldError;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  id,
  control,
  options,
  placeholder,
  error,
  disabled = false,
  icon,
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
        <Controller
          name={id}
          control={control}
          render={({ field }) => (
            <select
              id={id}
              className={`block w-full ${
                icon ? 'pl-10' : 'pl-3'
              } pr-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-600 sm:text-sm appearance-none ${
                error ? 'border-red-300' : 'border-gray-300'
              } ${disabled ? 'bg-gray-100' : ''}`}
              disabled={disabled}
              {...field}
            >
              <option value="">{placeholder || 'Selecione uma opção'}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormSelect;