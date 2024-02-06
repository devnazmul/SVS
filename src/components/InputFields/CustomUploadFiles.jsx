import React, { useEffect, useState } from "react";
import { IoCloudUploadSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { formatFileSize } from "../../utils/byeToMDorKB";
import { FiPlus } from "react-icons/fi";
import { ImFilesEmpty } from "react-icons/im";

export default function CustomUploadFiles({
  accept,
  files,
  setFiles,
  details,
}) {
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setDragOver(false);
  }, [files]);

  const handleDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...newFiles]);
  };

  const onChangeInput = (e) => {
    const inputFiles = e.target.files;
    setFiles([...files, ...inputFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileRemove = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };
  return (
    <div>
      <p className="text-sm font-semibold mb-2">Attachment</p>
      <div className="bg-base-300 border border-primary-content shadow-md rounded-xl pb-5">
        <div className="px-5 py-2 flex items-star md:items-center justify-start gap-2">
          <div className="border rounded-full border-gray-500 h-8 w-8 md:h-14 md:w-14 flex justify-center items-center">
            <ImFilesEmpty className="text-xl text-gray-500" />
          </div>
          <div>
            <h3 className="text-sm md:text-md font-medium ">Upload files</h3>
            <h5 className="text-xs md:text-md font-light ">
              Select and upload the files of your choice
            </h5>
          </div>
        </div>
        <hr className="my-5" />
        <div className="px-5 py-2">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`${
              dragOver ? "opacity-70" : "opacity-100"
            } relative flex justify-center px-5 md:px-10 items-center border-2 h-auto border-gray-500 border-dashed  py-16 rounded-xl flex-col`}
          >
            {files.length === 0 && (
              <label
                htmlFor="fl"
                className="absolute h-full w-full top-0 left-0"
              ></label>
            )}
            <input
              onChange={onChangeInput}
              multiple
              className="hidden"
              id="fl"
              type="file"
              accept={accept}
            />

            {files.length === 0 ? (
              <>
                <IoCloudUploadSharp className="text-3xl text-gray-500 " />
                <span className="text-sm md:text-md font-semibold text-center">
                  Choose a file or drag & drop it here
                </span>
                <span className="text-xs font-light text-center">
                  {details}
                </span>
                <label
                  htmlFor="fl"
                  disabled
                  className=" border mt-5 opacity-50 px-2 md:px-10 py-1 md:py-2 rounded-md border-gray-500 text-gray-500"
                >
                  Browse File
                </label>
              </>
            ) : (
              <div className="w-full grid grid-cols-1 xs:grid-cols-1  place-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5 h-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center w-[150px] md:w-[100px]"
                  >
                    <div
                      className="relative w-[150px] md:w-[100px] h-[150px] md:h-[100px] shadow-md rounded-xl  group flex justify-center items-center"
                      key={index}
                    >
                      <span className="font-semibold opacity-0 group-hover:opacity-100">
                        {formatFileSize(file.size)}
                      </span>

                      {file.type.startsWith("image/") && (
                        <div>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="h-full w-full duration-200 absolute top-0 cursor-pointer  rounded-xl  right-0 object-cover group-hover:opacity-20"
                          />
                        </div>
                      )}
                      <button
                        className="absolute -top-2 hover:scale-125 duration-200 -right-2 flex justify-center items-center bg-error w-7 h-7 rounded-full overflow-hidden shadow-md"
                        onClick={() => handleFileRemove(index)}
                      >
                        <RxCross2 className="text-base-300" />
                      </button>
                    </div>
                    <span className="text-primary text-xs block mt-2">
                      {file.name}
                    </span>
                  </div>
                ))}
                <label
                  data-tip="Add more"
                  htmlFor="fl"
                  className="flex flex-col w-[150px] md:w-[100px] h-[150px] md:h-[100px] justify-center items-center tooltip tooltip-right tooltip-primary"
                >
                  <div className="w-full h-full shadow-md rounded-md group flex justify-center items-center border-2 border-dashed  border-primary-content hover:bg-primary-content cursor-pointer text-gray-500 hover:text-primary">
                    <FiPlus className="text-2xl" />
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
