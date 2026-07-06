import { Label } from "../shared/label";

interface FormItemProps {
  label?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FormItem({ label, children, required = false }: FormItemProps) {
  return (
    <div className="space-y-2">
      {label && (
        <>
          <Label>{label}</Label>
          {required && <span className="text-rose-500">*</span>}
        </>
      )}
      {children}
    </div>
  );
}
