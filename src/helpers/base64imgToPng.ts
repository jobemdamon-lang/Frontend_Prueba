export const dataURLtoBlob = (dataURL: string) => {
  const byteString = window.atob(dataURL.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const intArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: 'image/png' });
}

export const base64imgtoPng = (imageData: string): ClipboardItem[] => {
  const imageBlob: Blob = dataURLtoBlob(imageData);
  const clipboardItems = [new ClipboardItem({ 'image/png': imageBlob })];
  //const imageFile = new File([imageBlob], 'imagen.png', { type: 'image/png' });
  //const clipboardData = new DataTransfer();
  //clipboardData.items.add(imageFile);
  return clipboardItems
}
