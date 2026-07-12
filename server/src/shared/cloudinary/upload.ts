import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "./index";
import "multer";

export function uploadStream({
  fileBuffer,
  folder,
  resourceType,
}: {
  fileBuffer: Buffer;
  folder: string;
  resourceType?: "image" | "video" | "raw";
}): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }

        resolve(result);
      },
    );

    stream.end(fileBuffer);
  });
}

export async function deleteAsset(
  publicId: string,
  resourceType: "image" | "video" | "raw",
) {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}
