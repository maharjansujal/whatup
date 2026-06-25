type ButtonVariant = "primary" | "secondary" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-btn-primary-bg hover:bg-btn-primary-hover text-btn-primary-text border-transparent",
  secondary:
    "bg-btn-secondary-bg hover:bg-btn-secondary-hover text-btn-secondary-text border-transparent",
  danger:
    "bg-btn-danger-bg hover:bg-btn-danger-hover text-btn-danger-text border-transparent",
  outline:
    "bg-btn-outline-bg hover:bg-btn-outline-hover border-btn-outline-border text-btn-outline-text",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-md",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-5 py-2.5 text-base rounded-xl",
};

export const Button = ({
  text,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {text}
    </button>
  );
};
