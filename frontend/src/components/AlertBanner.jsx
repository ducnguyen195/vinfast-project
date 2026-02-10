import React from 'react';

function AlertBanner({ type = 'info', message, onClose }) {
  const bgColor = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  }[type];

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className={`border-l-4 ${bgColor} px-4 py-3 rounded relative mb-4`}>
      <div className="flex items-center">
        <span className="mr-2 text-xl">{icons[type]}</span>
        <span>{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-2xl font-bold"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default AlertBanner;
