import { InputHTMLAttributes, forwardRef, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  variant?: "underline" | "filled";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, variant = "filled", ...props }, ref) => {
    const baseStyles = variant === "underline"
      ? "bg-transparent border-b-2 border-[var(--color-border)] rounded-none px-0 py-2 focus:border-[var(--color-primary)]"
      : "px-4 py-3 rounded-xl glass";
    
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full text-[var(--color-text-primary)] 
            placeholder-[var(--color-text-muted)] 
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
            transition-all duration-300
            ${baseStyles}
            ${error ? "ring-2 ring-[var(--color-error)] border-[var(--color-error)]" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[var(--color-error)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// Textarea 组件
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl glass text-[var(--color-text-primary)] 
            placeholder-[var(--color-text-muted)] 
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
            resize-none transition-all duration-300
            ${error ? "ring-2 ring-[var(--color-error)]" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[var(--color-error)]">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
export default Input;
