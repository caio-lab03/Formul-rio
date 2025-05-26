import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';

interface FormCheckboxGroupProps {
  label: string;
  id: string;
  options: string[];
  register: UseFormRegister<any>;
  error?: FieldError;
}

const FormCheckboxGroup: React.FC<FormCheckboxGroupProps> = ({
  label,
  id,
  options,
  register,
  error,
}) => {
  return (
    <div>
      <fieldset>
        <legend className="block text-sm font-medium text-gray-700">{label}</legend>
        <div className="mt-2 divide-y divide-gray-200 border border-gray-300 rounded-md p-2">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {options.map((option) => (
              <div key={option} className="relative flex items-start py-2">
                <div className="flex items-center h-5">
                  <input
                    id={`${id}-${option}`}
                    type="checkbox"
                    value={option}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    {...register(id)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={`${id}-${option}`} className="font-medium text-gray-700">
                    {option}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
            {error.message}
          </p>
        )}
      </fieldset>
    </div>
  );
};

export default FormCheckboxGroup;