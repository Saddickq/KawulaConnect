import axios from "axios";

export const checkIfImage = (filePath) => {
  const imageRegex = /\.(jpg|jpeg|svg|gif|png|webp|ico|tiff|bmp)$/i;
  return imageRegex.test(filePath);
};

export const downLoadFile = async (
  fileURL,
  setIsDownloading,
  setFileDownloadProgress
) => {
  setIsDownloading(true);
  setFileDownloadProgress(0);
  const response = await axios.get(fileURL, {
    responseType: "blob",
    onDownloadProgress: (progressEvent) => {
      const percentDownloaded = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setFileDownloadProgress(percentDownloaded);
    },
  });
  const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = urlBlob;
  const fileName = fileURL.split("/").pop();
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(urlBlob);
  setIsDownloading(false);
};
