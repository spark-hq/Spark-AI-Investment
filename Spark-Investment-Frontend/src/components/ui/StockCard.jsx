import React from 'react';

export const Card = React.memo(React.forwardRef(({
  className = '',
  children,
  onClick,
  style,
  role,
  tabIndex,
  onKeyPress,
  ...props
}, ref) => {
  // Make card keyboard accessible if clickable
  const isClickable = !!onClick;

  const handleKeyPress = (e) => {
    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick?.(e);
    }
    onKeyPress?.(e);
  };

  return (
    <div
      ref={ref}
      onClick={onClick}
      onKeyPress={handleKeyPress}
      role={isClickable ? (role || 'button') : role}
      tabIndex={isClickable ? (tabIndex || 0) : tabIndex}
      style={style}
      className={`bg-white rounded-xl shadow-md p-6 transition-all duration-300 ${
        isClickable ? 'cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}));

Card.displayName = 'Card';

export default Card;