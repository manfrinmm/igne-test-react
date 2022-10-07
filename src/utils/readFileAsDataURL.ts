export default async function readFileAsDataURL(file: File) {
  const result_base64 = await new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => resolve(fileReader.result);
    fileReader.readAsDataURL(file);
  });

  return result_base64;
}
