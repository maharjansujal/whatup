import { createContext, useContext, useState, type ReactNode } from "react";

interface ModalContextValue {
  stack: ReactNode[];
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<ReactNode[]>([]);

  const openModal = (m: ReactNode) => {
    setStack((prev) => [...prev, m]); // push new modal
  };

  const closeModal = () => {
    setStack((prev) => prev.slice(0, -1)); // pop top modal
  };

  return (
    <ModalContext.Provider value={{ stack, openModal, closeModal }}>
      {children}
      {stack.length > 0 && stack[stack.length - 1]} {/* render top modal */}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
