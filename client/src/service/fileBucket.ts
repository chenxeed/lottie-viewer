interface UploadFile {
  destination: string;
  encoding: string;
  fieldname: string;
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  size: number;
}

const BUCKET_PATH = "/bucket/uploads/";
const BUCKET_API = "/bucket/upload/";

export const getFilePath = (filename: string) => `${BUCKET_PATH}${filename}`;

/**
 * A service that allows the user to upload a file to the bucket,
 * and access them through public URL
 */
export async function uploadFileToBucket(file: File): Promise<UploadFile> {
  // Try to upload
  const formData = new FormData();
  formData.append("file", file);

  const result = await fetch(BUCKET_API, {
    method: "POST",
    body: formData,
  });

  const response = await result.json();
  return response.data as UploadFile;
}

/**
 * Given the filename, append the path and fetch it from the bucket
 */
export async function fetchFileContentFromBucket(
  filename: string,
): Promise<string> {
  const result = await fetch(getFilePath(filename));
  return result.text();
}

/**
 * Given a public URL, fetch the content for the texts
 */
export async function fetchFileContentFromPublicURL(
  publicUrl: string,
): Promise<string> {
  const result = await fetch(publicUrl);
  return result.text();
}

/**
 * Given a public URL, fetch the content and return it as a file
 */
export async function fetchFileFromPublicURL(
  publicUrl: string,
  name?: string,
): Promise<File> {
  const result = await fetch(publicUrl);
  const blob = await result.blob();
  const fileName = name || publicUrl.split("/").pop() || "file";
  const file = new File([blob], fileName);
  return file;
}

/**
 * Convert a data URL to a blob
 */
export async function dataURLtoBlob(dataURL: string) {
  return await fetch(dataURL).then((r) => r.blob());
}
