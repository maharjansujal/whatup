import {
  FileText,
  FileSpreadsheet,
  FileArchive,
  Music,
  Video,
  File,
  Download,
} from "lucide-react";
import type { Attachment } from "../../types/message";
import { formatFileSize } from "../../utils/formatFileSize";

interface MessageAttachmentProps {
  attachment: Attachment;
  isOwn: boolean;
}

function getFileIcon(mimeType: string | null) {
  if (!mimeType) return File;
  if (
    mimeType.includes("spreadsheet") ||
    mimeType.includes("csv") ||
    mimeType.includes("excel")
  )
    return FileSpreadsheet;
  if (
    mimeType.includes("zip") ||
    mimeType.includes("compressed") ||
    mimeType.includes("archive")
  )
    return FileArchive;
  if (mimeType.startsWith("audio/")) return Music;
  if (mimeType.startsWith("video/")) return Video;
  if (
    mimeType.startsWith("text/") ||
    mimeType.includes("pdf") ||
    mimeType.includes("document")
  )
    return FileText;
  return File;
}

export function MessageAttachment({
  attachment,
  isOwn,
}: MessageAttachmentProps) {
  const isImage = attachment.mime_type?.startsWith("image/") ?? false;

  if (isImage) {
    return (
      <a
        href={attachment.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative mb-1 block overflow-hidden rounded-lg"
      >
        <img
          src={attachment.thumbnail_url ?? attachment.file_url}
          alt={attachment.filename ?? "Image attachment"}
          className="max-w-65 rounded-lg transition-opacity group-hover:opacity-90"
        />
      </a>
    );
  }

  const Icon = getFileIcon(attachment.mime_type);

  return (
    <a
      href={attachment.file_url}
      download={attachment.filename ?? undefined}
      target="_blank"
      rel="noopener noreferrer"
      className={`group mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
        isOwn ? "bg-white/15 hover:bg-white/20" : "bg-white hover:bg-[#F2F2EF]"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          isOwn ? "bg-white/15" : "bg-[#00C2A8]/10"
        }`}
      >
        <Icon size={17} className={isOwn ? "text-white" : "text-[#00C2A8]"} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[12.5px] font-medium">
          {attachment.filename ?? "Untitled file"}
        </p>
        <p
          className={`text-[10.5px] ${
            isOwn ? "text-white/70" : "text-[#9A9CA8]"
          }`}
        >
          {formatFileSize(Number(attachment.size))}
        </p>
      </div>

      <Download
        size={15}
        className={`shrink-0 opacity-0 transition-opacity group-hover:opacity-100 ${
          isOwn ? "text-white/80" : "text-[#9A9CA8]"
        }`}
      />
    </a>
  );
}
