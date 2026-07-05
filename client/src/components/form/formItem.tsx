import { Label } from "../shared/label";

interface FormItemProps {
  label?: string;
  children: React.ReactNode;
}

export function FormItem({ label, children }: FormItemProps) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      {children}
    </div>
  );
}
