function Card({ children, className = '', title, subtitle }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-6 shadow-card ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-brand-black">{title}</h3>
      )}
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
      <div className={title || subtitle ? 'mt-4' : ''}>{children}</div>
    </div>
  );
}

export default Card;
