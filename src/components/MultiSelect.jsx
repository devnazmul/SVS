import React, { useState } from "react";

const MultiSelect = () => {
  const options = [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5",
    "Option 6",
  ];
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleCheckboxChange = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(
        selectedOptions.filter((selectedOption) => selectedOption !== option)
      );
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleInputClick = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative inline-block text-left">
        <div>
          <span className="rounded-md shadow-sm">
            <input
              type="text"
              readOnly
              value={selectedOptions.join(", ")}
              className="cursor-pointer bg-white border rounded-md p-2 focus:outline-none"
              onClick={handleInputClick}
              style={{ height: "2.5rem", width: "200px" }} // Adjust the height and width as needed
            />
          </span>
        </div>
        {isDropdownVisible && (
          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div
              className="py-1 flex flex-wrap"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {options.map((option) => (
                <div
                  key={option}
                  className="flex items-center p-2"
                  style={{ minWidth: "40px" }} // Set a fixed width or adjust as needed
                >
                  <input
                    type="checkbox"
                    id={option}
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                    className="mr-2"
                  />
                  <label htmlFor={option}>{option}</label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
