import React, { useEffect, useState } from "react";

export default function BusinessViewMenu({
  onClick = (e) => {
    return e;
  },
}) {
  const [selectedMenu, setSelectedMenu] = useState("Business Details");
  useEffect(() => {
    onClick(selectedMenu);
  }, [selectedMenu]);

  // CHANGE NAVBAR COLLAPSE
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleClick = (e) => {
    if (e.target.checked) {
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  };
  useEffect(() => {
    setIsMenuOpen(false);
  }, [selectedMenu]);
  return (
    <div className="mb-5 mt-10">
      {/* FOR MOBILE  */}
      <div className="collapse lg:hidden collapse-arrow bg-base-200 shadow-md shadow-primary-content">
        <input
          onChange={handleClick}
          checked={isMenuOpen}
          type="checkbox"
          name="my-accordion-2"
        />
        <div className="collapse-title text-xl font-medium bg-primary text-base-300">
          {selectedMenu}
        </div>
        <div className="collapse-content ">
          <div className="mt-4 flex flex-col gap-1 justify-between items-center  py-2">
            <button
              className={`${
                selectedMenu !== "Business Details" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Business Details")}
            >
              Business Details
            </button>
            {/* <button
              className={`${
                selectedMenu !== "Business Owner Details" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Business Owner Details")}
            >
              Business Owner Details
            </button> */}
            <button
              className={`${
                selectedMenu !== "Business Timing" && "btn-outline"
              } font-semibold btn btn-primary w-full`}
              onClick={() => setSelectedMenu("Business Timing")}
            >
              Business Timing
            </button>
          </div>
        </div>
      </div>

      {/* FOR DESKTOP  */}
      <div className="mt-1 hidden lg:flex gap-5 justify-center items-center">
        <button
          className={`${
            selectedMenu !== "Business Details"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary w-52`}
          onClick={() => setSelectedMenu("Business Details")}
        >
          Business Details
        </button>
        {/* <button
          className={`${
            selectedMenu !== "Business Owner Details"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary w-52`}
          onClick={() => setSelectedMenu("Business Owner Details")}
        >
          Business Owner Details
        </button> */}
        <button
          className={`${
            selectedMenu !== "Business Timing"
              ? "btn-outline"
              : "shadow-lg shadow-primary-content"
          } font-semibold btn btn-primary w-52`}
          onClick={() => setSelectedMenu("Business Timing")}
        >
          Business Timing
        </button>
      </div>
    </div>
  );
}
