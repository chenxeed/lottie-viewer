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

export const getFilePath = (filename: string) => `/bucket/uploads/${filename}`;

export async function uploadFileToBucket (file: File): Promise<UploadFile> {
  // Try to upload
  const formData = new FormData();
  formData.append('file', file);

  const result = await fetch('/bucket/upload', {
    method: 'POST',
    body: formData
  })
  
  const response = await result.json();
  return response.data as UploadFile;
}

export async function fetchFileContentFromBucket (filename: string): Promise<string> {
  const result = await fetch(getFilePath(filename));
  return result.text();
}

export async function fetchFileContentFromPublicURL (publicUrl: string): Promise<string> {
  const result = await fetch(publicUrl);
  return result.text();
}
