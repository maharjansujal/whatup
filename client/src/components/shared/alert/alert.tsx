import { Check, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

export type AlertType = "success" | "error" | "info";

type Props = {
  message: string;
  type: AlertType;
  label?: string;
  onDismiss?: () => void;
};

const VARIANTS = {
  success: {
    icon: Check,
    label: "Changes saved",
    className: "bg-success-soft text-success border border-success-border",
    iconClassName: "bg-success text-white",
  },

  error: {
    icon: AlertCircle,
    label: "Error",
    className: "bg-danger-soft text-danger border border-danger-border",
    iconClassName: "bg-danger text-white",
  },

  info: {
    icon: Info,
    label: "Info",
    className: "bg-info-soft text-info border border-info-border",
    iconClassName: "bg-info text-white",
  },

  warning: {
    icon: AlertTriangle,
    label: "Warning",
    className: "bg-warning-soft text-warning border border-warning-border",
    iconClassName: "bg-warning text-white",
  },
} as const;

export default function Alert({ message, type, label, onDismiss }: Props) {
  const v = VARIANTS[type];
  const Icon = v.icon;

  return (
    <div className="fixed top-6 left-0 right-0 flex justify-center z-9999 pointer-events-none">
      <div
        className={[
          "pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl",
          "shadow-lg backdrop-blur-md max-w-sm w-full mx-4",
          v.className,
        ].join(" ")}
      >
        {/* Icon */}
        <div
          className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${v.iconClassName}`}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-snug">
            {label ?? v.label}
          </p>
          <p className="text-xs mt-0.5 opacity-80 leading-snug">{message}</p>
        </div>

        {/* Close */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="mt-0.5 shrink-0 rounded p-1 opacity-50 transition-all hover:bg-surface-hover hover:opacity-100"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
