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
      className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2"
    >
      <input
        type="text"
        value={messageText}
        onChange={handleInputChange}
        placeholder={`Message ${name}...`}
        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white"
      />
      <Button text="Send" variant="primary" size="md"></Button>
    </form>
  );
};
