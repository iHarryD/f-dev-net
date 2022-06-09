interface optimizeImageParams {
  imageFile: File;
  width: number;
  keepRatio: boolean;
}

export function optimizeImage(
  imageFile: File,
  width: number,
  keepRatio: boolean = false
): string {
  let toReturn = "";
  const reader = new FileReader();
  reader.readAsDataURL(imageFile);
  reader.onload = () => {
    const imageElement = document.createElement("img");
    imageElement.setAttribute("src", reader.result as string);
    imageElement.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = keepRatio
        ? imageElement.height * (width / imageElement.width)
        : width;
      const context = canvas.getContext("2d");
      context?.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
      const encodedImage = context?.canvas.toDataURL(
        imageElement.src,
        "image/jpeg"
      );
      if (encodedImage) {
        toReturn = encodedImage;
      }
    };
  };
  return toReturn;
}
