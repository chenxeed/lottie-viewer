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
