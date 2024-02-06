import React, { useState, useEffect } from "react";
import { AiOutlineClose, AiOutlineDownload } from "react-icons/ai";
import { FiDownloadCloud } from "react-icons/fi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoCloudDownloadSharp } from "react-icons/io5";
import { Document, Page } from "react-pdf";

const FileViewer = ({ files, onClose, handleClosePopup }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : files.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < files.length - 1 ? prevIndex + 1 : 0
    );
  };

  // const handleDownload = async (i) => {
  //   const currentFile = files[i];

  //   try {
  //     const response = await fetch(currentFile);
  //     const blob = await response.blob();
  //     const blobUrl = URL.createObjectURL(blob);

  //     const downloadLink = document.createElement("a");
  //     downloadLink.href = blobUrl;
  //     downloadLink.download = `file_${i + 1}`;
  //     downloadLink.click();
  //   } catch (error) {
  //     console.error("Error downloading file:", error);
  //   }
  // };
  const handleDownload = (fileUrl) => {
    // Extract the file name from the URL
    const fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);

    fetch(fileUrl, {
      method: "GET",
      mode: "cors",
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create a link element
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);

        // Append the link to the document
        document.body.appendChild(link);

        // Trigger a click on the link to start the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
      })
      .catch((error) => console.error("Error downloading file:", error));
  };

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Prevent scrolling when the file viewer is open
    return () => {
      document.body.style.overflow = "auto"; // Enable scrolling when the file viewer is closed
    };
  }, []);

  return (
    <div className="file-viewer pb-5">
      <div className="overlay" onClick={onClose}></div>

      <div className="viewer-container pl-2">
        {files.map((file, index) => (
          <div
            key={index}
            className={`file-slide pt-5 ${
              index === currentIndex ? "block" : "hidden"
            }`}
          >
            <div className="file-info flex justify-between items-center mb-3 pr-2">
              <span className="file-name text-primary font-semibold">{`${
                index + 1
              }. ${file.split("/")[file.split("/").length - 1]}`}</span>
              {/* <div className="controls">
                <button
                  data-tip="download"
                  className="download-btn tooltip tooltip-left tooltip-primary"
                  onClick={() => handleDownload(file)}
                >
                  <FiDownloadCloud className="text-xl text-primary" />
                </button>
              </div> */}
            </div>
            {file.endsWith(".pdf") ? (
              <Document file={file}>
                <Page pageNumber={1} />
              </Document>
            ) : (
              <img
                src={file}
                alt={`${file.split("/")[file.split("/").length - 1]}`}
              />
            )}
          </div>
        ))}
        {files.length > 1 && (
          <div className="flex justify-between items-center mt-5">
            <button
              data-tip="previous"
              className="nav-btn prev tooltip tooltip-primary tooltip-right h-10 w-10 rounded-full btn-primary  flex justify-center items-center"
              onClick={handlePrev}
            >
              <IoIosArrowBack className="text-base-300 text-xl" />
            </button>
            <button
              data-tip="next"
              className="nav-btn next tooltip tooltip-primary tooltip-left h-10 w-10 rounded-full btn-primary  flex justify-center items-center"
              onClick={handleNext}
            >
              <IoIosArrowForward className="text-base-300 text-xl" />
            </button>
          </div>
        )}
      </div>

      {/* CLOSE BUTTON  */}
      <div className="flex flex-col md:flex-row w-full justify-center md:justify-end items-center mt-5 gap-2">
        <button onClick={handleClosePopup} className="btn w-full btn-primary">
          Close
        </button>
      </div>
    </div>
  );
};

export default FileViewer;
