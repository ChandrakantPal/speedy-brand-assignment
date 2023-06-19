import * as React from "react";

const Modal: React.FC<
  React.PropsWithChildren<{ open: boolean; onClose: () => void }>
> = ({ open, onClose, children }) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center w-full ${
        open ? "visible" : "invisible"
      }`}
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div
        className="relative z-10 p-6 w-[80%] md:min-w-[40%] max-h-[90vh] overflow-y-scroll md:w-fit bg-white rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
