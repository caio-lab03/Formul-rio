import React, { useState } from 'react';
import { Control, Controller, FieldError } from 'react-hook-form';

interface FormFileUploadProps {
  label: string;
  id: string;
  accept: string;
  control: Control<any>;
  error?: FieldError;
  progress?: number;
  icon?: React.ReactNode;
}

const FormFileUpload: React.FC<FormFileUploadProps> = ({
  label,
  id,
  accept,
  control,
  error,
  progress = 0,
  icon,
}) => {
  const [filename, setFilename] = useState<string>('');

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Controller
        name={id}
        control={control}
        render={({ field: { onChange, value, ...field } }) => (
          <div className="mt-1">
            <div
              className={`flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                error ? 'border-red-300' : 'border-gray-300'
              } hover:border-gray-400 transition-colors duration-200`}
            >
              <div className="space-y-1 text-center">
                <div className="flex justify-center">
                  {icon || (
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor={`file-upload-${id}`}
                    className="relative cursor-pointer rounded-md font-medium text-red-600 hover:text-red-500 focus-within:outline-none"
                  >
                    <span>Carregar um arquivo</span>
                    <input
                      id={`file-upload-${id}`}
                      type="file"
                      className="sr-only"
                      accept={accept}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFilename(file.name);
                          onChange(file);
                        }
                      }}
                      {...field}
                    />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-gray-500">PDF até 10MB</p>
                {filename && (
                  <p className="text-sm text-gray-700 truncate max-w-xs mx-auto">
                    {filename}
                  </p>
                )}
                {progress > 0 && progress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
                {error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default FormFileUpload;