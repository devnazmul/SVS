export const getFileDetailsFromUrl = async ({ fileUrl }) => {
  try {
    const response = await fetch(fileUrl);
    const contentDisposition = response.headers.get("content-disposition");
    const fileName = contentDisposition
      ? contentDisposition.split("filename=")[1]
      : "Unknown";

    return {
      type: response.headers.get("content-type"),
      size: response.headers.get("content-length"),
      title: fileName,
    };
  } catch (error) {
    return { title: null, type: null, size: null };
  }
};
