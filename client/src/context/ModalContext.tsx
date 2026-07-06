import { createContext, useContext, useState, type ReactNode } from "react";

interface ModalContextValue {
  isOpen: boolean;
  content: ReactNode | null;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode | null>(null);

  const openModal = (m: ReactNode) => {
    setContent(m);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Optional: clear content after transition
    setTimeout(() => setContent(null), 200);
  };

  return (
    <ModalContext.Provider value={{ isOpen, openModal, content, closeModal }}>
      {children}
      {isOpen && content}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
