import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "./index";

export function uploadStream({
  fileBuffer,
  folder,
  resourceType = "auto",
}: {
  fileBuffer: Buffer;
  folder: string;
  resourceType?: "auto" | "image" | "video" | "raw";
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
  resourceType: "image" | "video" | "raw" | "auto" = "auto",
) {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}
