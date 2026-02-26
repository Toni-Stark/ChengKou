import React from 'react';

function Loading({ message = '加载中...', size = 'medium' }) {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4'
  };

  const containerClasses = {
    small: 'py-4',
    medium: 'py-8',
    large: 'py-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]}`}>
      <div className={`${sizeClasses[size]} border-journal-highlight border-t-transparent rounded-full animate-spin`}></div>
      {message && (
        <p className="mt-3 text-journal-muted text-sm">{message}</p>
      )}
    </div>
  );
}

export default Loading;
