import { motion } from 'framer-motion';

function Button({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) {
  const baseStyles = 'px-4 py-2.5 rounded-card font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-soft',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export default Button;