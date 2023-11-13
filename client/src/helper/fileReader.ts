interface Option {
  accept?: string;
}

export function readFile (file: File, option: Option = {}) {

  const reader = new FileReader();
  const promise = new Promise<string>((res) => {
    reader.addEventListener('load', (e) => {
      const result = e.target?.result as string;
      res(result);
    });
  });

  reader.readAsText(file);

  return promise;
}