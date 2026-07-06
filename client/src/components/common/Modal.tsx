import { type ReactNode } from "react";

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-100 h-3/5 overflow-y-auto rounded-lg bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold">{title}</h2>

          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
