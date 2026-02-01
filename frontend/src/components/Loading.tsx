import React from 'react';

interface LoadingProps {
  variant?: 'spinner' | 'skeleton';
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'medium',
  text,
  className = '',
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  if (variant === 'skeleton') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className={`bg-gray-200 rounded-md ${sizeClasses[size]}`}>
          <div className="h-full w-full rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
        </div>
        {text && (
          <div className="mt-2 h-4 w-24 bg-gray-200 rounded animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`
          border-4 border-gray-200 border-t-blue-500 rounded-full
          animate-spin
          ${sizeClasses[size]}
        `}
      />
      {text && (
        <p
          className={`
            mt-2 text-gray-600 font-medium
            ${textSizeClasses[size]}
          `}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default Loading;