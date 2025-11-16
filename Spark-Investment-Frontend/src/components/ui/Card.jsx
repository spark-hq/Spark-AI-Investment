const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  padding = 'lg',
  hover = false 
}) => {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const hoverEffect = hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-98 active:shadow-md cursor-pointer' : '';
  
  return (
    <div className={`bg-white rounded-xl shadow-lg ${paddings[padding]} ${hoverEffect} ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;