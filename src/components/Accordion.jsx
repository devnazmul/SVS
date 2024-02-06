// ===========================================
// #00118
// ===========================================
import { useState } from 'react';

const Accordion = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-md shadow-md">
        <button
          className="w-full px-4 py-3 flex items-center justify-between bg-blue-500 text-white font-medium"
          onClick={toggleAccordion}
        >
          <span>Accordion Title</span>
          <svg
            className={`w-6 h-6 transition-transform transform ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="px-4 py-3 bg-white">
            <p>Accordion Content</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accordion;
