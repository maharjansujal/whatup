import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const generatedId = id || props.name;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={generatedId}
            className="text-xs font-semibold text-sidebar/80 tracking-wide uppercase"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={generatedId}
          className={`w-full px-3 py-2 bg-white border rounded-lg text-sm shadow-xs placeholder:text-muted/60 transition-all focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 ${
            error
              ? "border-error focus:border-error focus:ring-error/10"
              : "border-border-light"
          } ${className}`}
          {...props}
        />

        {error && (
          <span className="text-xs text-error font-medium mt-0.5">{error}</span>
        )}
      </div>
    );
  },
);
