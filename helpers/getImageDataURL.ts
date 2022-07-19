import { isImage } from "./isImage";

export function getImageDataURL(file: File) {
  return new Promise((resolve, reject) => {
    if (isImage(file)) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onloadend = () => resolve(fileReader.result);
    } else {
      reject("File is not a valid image.");
    }
  });
}
