export function isImage(file: File | DataTransferItem) {
  const possibleImageExtensions = ["jpeg", "png", "jpg"];
  for (let i = 0; i < possibleImageExtensions.length; i++) {
    if (file.type === `image/${possibleImageExtensions[i]}`) return true;
  }
  return false;
}
