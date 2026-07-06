import { useState } from "react";
import { useGetUsers } from "../../hooks/get/useGetUsers";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { Modal } from "../common/Modal";
import { UserSearchList } from "../common/UserList";

export function SearchPeopleModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const { users } = useGetUsers();
  const { authUser: currentUser } = useAuth();
  const { startDirectConversation } = useChat();

  return (
    <Modal title="Find people" onClose={onClose}>
      <UserSearchList
        users={users}
        currentUserId={currentUser?.id}
        query={query}
        setQuery={setQuery}
        onSelect={(id) => {
          console.log(id);
          startDirectConversation(id);
          onClose();
        }}
      />
    </Modal>
  );
}
