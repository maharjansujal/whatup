import type { Attachment } from "../../types/message";
import { formatFileSize } from "../../utils/formatFileSize";

interface MessageAttachmentProps {
  attachment: Attachment;
  isOwn: boolean;
}

export function MessageAttachment({
  attachment,
  isOwn,
}: MessageAttachmentProps) {
  const isImage = attachment.mime_type.startsWith("image/");

  if (isImage) {
    return (
      <img
        src={attachment.thumbnail_url ?? attachment.file_url}
        alt={attachment.filename}
        className="mb-1 max-w-65 rounded-lg"
      />
    );
  }

  return (
    <div
      className={`mb-1 flex items-center gap-2 rounded-lg px-2.5 py-2 ${
        isOwn ? "bg-white/15" : "bg-white"
      }`}
    >
      {/* File icon */}

      <div className="min-w-0 flex-1 cursor-pointer">
        <p className="truncate text-[12.5px] font-medium">
          {attachment.filename}
        </p>
        <a
          href={attachment.file_url}
          download={attachment.filename}
          target="_blank"
          rel="noopener noreferrer"
        >
          Download
        </a>
        <p
          className={`text-[10.5px] ${
            isOwn ? "text-white/70" : "text-[#9A9CA8]"
          }`}
        >
          {formatFileSize(Number(attachment.size))}
        </p>
      </div>

      {/* Download button */}
    </div>
  );
}
