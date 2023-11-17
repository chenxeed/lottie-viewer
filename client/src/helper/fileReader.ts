interface Option {
  accept: string;
  readAs: "text" | "binary" | "dataURL" | "arrayBuffer";
}

interface ReadFileResult {
  text: string;
  binary: string;
  dataURL: string;
  arrayBuffer: ArrayBuffer;
}

export function readFile<T extends Option["readAs"]>(
  file: File,
  readAs?: T,
): Promise<ReadFileResult[T] | undefined | null> {
  const reader = new FileReader();
  const promise = new Promise<ReadFileResult[T] | undefined | null>((res) => {
    reader.addEventListener("load", (e) => {
      const result = e.target?.result;
      res(result as ReadFileResult[T] | undefined | null);
    });
  });

  switch (readAs) {
    case "text":
      reader.readAsText(file);
      break;
    case "binary":
      reader.readAsBinaryString(file);
      break;
    case "dataURL":
      reader.readAsDataURL(file);
      break;
    case "arrayBuffer":
      reader.readAsArrayBuffer(file);
      break;
  }

  return promise;
}
