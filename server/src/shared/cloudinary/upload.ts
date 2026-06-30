import { cloudinary } from "./index";
import { UploadApiResponse } from "cloudinary";

export function uploadStream(
  fileBuffer: Buffer,
  folder: string,
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      },
    );

    stream.end(fileBuffer);
  });
}
