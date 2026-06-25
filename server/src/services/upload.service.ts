import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";

export const uploadImage = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "chat-app",
      },
      (error, result) => {
        if (error) return reject(error);

        resolve((result as UploadApiResponse).secure_url);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
