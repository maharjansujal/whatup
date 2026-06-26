// ModalProvider.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import { Modal } from "../components/shared/Modal";

type ModalState = {
  isOpen: boolean;
  content: ReactNode | null;
  title?: string;
};

type ModalContextType = {
  openModal: (content: ReactNode, title?: string) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    content: null,
    title: "",
  });

  const openModal = (content: ReactNode, title?: string) => {
    setModalState({
      isOpen: true,
      content,
      title,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      content: null,
      title: "",
    });
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
      >
        {modalState.content}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used inside ModalProvider");
  }
  return context;
};
