import { Modal } from "../../common/Modal";
import { Button } from "../button";

type Props = {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function Confirm({
  open,
  title,
  message,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;
  return (
    <Modal onClose={onClose} title={title}>
      <div className="flex flex-col gap-6">
        <p className="text-sm text-secondary">{message}</p>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="danger">
            Cancel
          </Button>

          <Button onClick={onConfirm} variant="default">
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
}
