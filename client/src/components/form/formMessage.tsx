interface FormMessageProps {
  message?: string;
}

export function FormMessage({ message }: FormMessageProps) {
  if (!message) return null;
  return <p className="text-sm text-red-600">{message}</p>;
}
