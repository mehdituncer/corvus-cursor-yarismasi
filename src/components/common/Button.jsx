import { forwardRef } from 'react'

/**
 * Erişilebilir buton bileşeni
 * - Klavye navigasyonu desteği
 * - ARIA etiketleri
 * - Focus göstergeleri
 */
const Button = forwardRef(({ 
  children, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  onClick,
  type = 'button',
  className = '',
  ...props 
}, ref) => {
  const baseStyles = ' flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-gray-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 focus:ring-primary-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-gray-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export default Button

