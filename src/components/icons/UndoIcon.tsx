import * as React from "react";

const UndoIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="w-5 h-5"
    >
      <title>Undo</title>
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
      ></path>
    </svg>
  );
};

export default UndoIcon;
