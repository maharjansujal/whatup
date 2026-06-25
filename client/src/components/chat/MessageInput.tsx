import { Button } from "../ui/Button";

interface Props {
  onSendMessage: (e: React.SubmitEvent<Element>) => void;
  messageText: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

export const MessageInput = ({
  onSendMessage,
  messageText,
  handleInputChange,
  name,
}: Props) => {
  return (
    <form
      onSubmit={onSendMessage}
      className="p-4 border-t bg-(--color-background) flex gap-2 border-(--color-border)"
    >
      <input
        type="text"
        value={messageText}
        onChange={handleInputChange}
        placeholder={`Message ${name}...`}
        className="flex-1 bg-(--color-surface) border border-(--color-border) rounded-lg px-4 py-2 text-sm text-(--color-text-primary) focus:outline-none focus:border-(--color-brand-primary)"
      />
      <Button text="Send" variant="primary" size="md" />
    </form>
  );
};
