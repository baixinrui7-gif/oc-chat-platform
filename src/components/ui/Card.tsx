import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "glow";
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", variant = "glass", hover = false, children, ...props }, ref) => {
    const variantStyles = {
      default: "bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl",
      glass: "glass rounded-2xl",
      glow: "glass rounded-2xl glow-border hover:shadow-[0_0_30px_var(--glow-primary)] transition-shadow duration-300",
    };

    const hoverStyles = hover 
      ? "hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] cursor-pointer transition-all duration-300" 
      : "";

    return (
      <div
        ref={ref}
        className={`${variantStyles[variant]} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
