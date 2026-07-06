import { useState } from "react";
import { useGetUsers } from "../../hooks/get/useGetUsers";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { Modal } from "../common/Modal";
import { UserSearchList } from "../common/UserList";
import { useModal } from "../../context/ModalContext";

export function SearchPeopleModal({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState("");

  const { users } = useGetUsers();
  const { authUser: currentUser } = useAuth();
  const { startDirectConversation } = useChat();
  const { closeModal } = useModal();

  const handleClose = () => {
    if (onClose) onClose();
    else closeModal();
  };

  return (
    <Modal title="Find people" onClose={handleClose}>
      <UserSearchList
        users={users}
        currentUserId={currentUser?.id}
        query={query}
        setQuery={setQuery}
        onSelect={(id) => {
          startDirectConversation(id);
          handleClose();
        }}
      />
    </Modal>
  );
}
