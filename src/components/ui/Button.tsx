import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-base)] disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantStyles = {
      primary: "glass glow-border text-[var(--color-accent)] hover:bg-[var(--color-bg-elevated)] focus:ring-[var(--color-primary)]",
      gradient: "bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary-light)] text-[var(--color-bg-base)] font-semibold hover:shadow-[0_0_25px_var(--glow-accent)] hover:scale-105 focus:ring-[var(--color-accent)]",
      secondary: "glass text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)] focus:ring-[var(--color-border)]",
      ghost: "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)] focus:ring-[var(--color-border)]",
    };
    
    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
