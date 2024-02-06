import React, { useEffect, useState } from "react";
import { IoCloudUploadSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { formatFileSize } from "../../utils/byeToMDorKB";
import { FiPlus } from "react-icons/fi";
import { ImFilesEmpty } from "react-icons/im";
import { getFullImageLink } from "../../utils/getFullImageLink";

export default function CustomUploadFilesOneByOne({
  accept,
  files,
  setFiles,
  details,
  isFileUploading = false,
  onRemove = (e) => {
    return e;
  },

  onDrop = (e) => {
    return e;
  },
}) {
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setDragOver(false);
  }, [files]);

  const handleDrop = (e) => {
    e.preventDefault();
    onDrop(e);
    console.log({ fileData: e });
  };

  const onChangeInput = (e) => {
    setFiles({ file: e, index: files?.length });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleFileRemove = (index) => {
    onRemove(index);
  };
  return (
    <div>
      <p className="text-sm font-semibold mb-2">Attachment</p>
      <div className="bg-base-300 border border-primary-content shadow-md rounded-xl pb-4">
        <div className="px-5 py-2 flex items-star md:items-center justify-start gap-2">
          <div className="border rounded-full border-gray-500 h-8 w-8 md:h-10 md:w-10 flex justify-center items-center">
            <ImFilesEmpty className="text-sm text-gray-500" />
          </div>
          <div>
            <h3 className="text-sm md:text-md font-medium ">Upload files</h3>
            <h5 className="text-xs md:text-md font-light ">
              Select and upload the files of your choice
            </h5>
          </div>
        </div>
        <hr className="mb-5" />

        <div className="px-5 relative">
          {isFileUploading && (
            <div
              className={`absolute bg-opacity-70 top-0 left-[1.25rem]  h-full flex gap-2 flex-col justify-center items-center w-[calc(100%-2.5rem)] rounded-xl z-40 bg-primary-content`}
            >
              <span
                className={`loading loading-spinner text-primary loading-lg`}
              ></span>

              <h1 className={`text-primary `}>Uploading...</h1>
            </div>
          )}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`${
              dragOver ? "opacity-70" : "opacity-100"
            } relative flex justify-center px-5 items-center border-2 h-auto border-gray-500 border-dashed  py-10 rounded-xl flex-col`}
          >
            {files?.length === 0 && (
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
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 h-auto">
                {files.map((file, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="relative w-[200px] sm:w-[100px] h-[200px] sm:h-[100px] shadow-md rounded-xl  group flex justify-center items-center"
                      key={index}
                    >
                      {file !== "" && (
                        <div>
                          {/* <iframe
                            className="h-full w-full duration-200 absolute top-0 cursor-pointer  rounded-xl  right-0 object-cover "
                            src={getFullImageLink(file)}
                          /> */}
                          <img
                            src={getFullImageLink(file)}
                            alt={file.name}
                            className="h-full w-full duration-200 absolute top-0 cursor-pointer  rounded-xl  right-0 object-cover group-hover:opacity-20"
                          />
                        </div>
                      )}
                      <button
                        className="absolute -top-2 hover:scale-125 duration-200 -right-2 flex justify-center items-center bg-error w-7 h-7 rounded-full overflow-hidden shadow-md"
                        onClick={() => handleFileRemove(file)}
                      >
                        <RxCross2 className="text-base-300" />
                      </button>
                    </div>
                  </div>
                ))}
                <label
                  data-tip="Add more"
                  htmlFor="fl"
                  className="flex flex-col items-center tooltip tooltip-right tooltip-primary"
                >
                  <div className="w-[200px] sm:w-[100px] h-[200px] sm:h-[100px] bg-base-300  shadow-md rounded-xl border-2 border-dashed   group flex justify-center items-center  hover:border-primary cursor-pointer text-gray-500 hover:text-primary">
                    <FiPlus className="text-5xl md:text-3xl" />
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
