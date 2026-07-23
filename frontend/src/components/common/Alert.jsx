const variantStyles = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-900 border-yellow-300',
  info: 'bg-gray-50 text-gray-800 border-gray-200'
};

function Alert({ variant = 'info', children, onClose }) {
  return (
    <div
      className={`flex items-start justify-between rounded-md border px-4 py-3 text-sm ${variantStyles[variant]}`}
      role="alert"
    >
      <span>{children}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 font-bold leading-none opacity-60 hover:opacity-100"
          aria-label="Dismiss"
        >
          &times;
        </button>
      )}
    </div>
  );
}

export default Alert;
