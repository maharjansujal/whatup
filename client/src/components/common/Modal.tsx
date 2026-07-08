import { X } from "lucide-react";
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="flex h-[70vh] w-100 flex-col overflow-hidden rounded-lg bg-white p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold">{title}</h2>

          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-[#8A8D9F] transition-colors hover:bg-[#F2F2EF] hover:text-[#1A1B23]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-3 flex flex-1 min-h-0 flex-col">{children}</div>
      </div>
    </div>
  );
}
