import * as React from "react";

const MagicIcon: React.FC<React.SVGProps<SVGSVGElement>> = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24"
      viewBox="0 -960 960 960"
      width="24"
      className="w-5 h-5"
      fill="#fff"
      stroke="currentColor"
    >
      <path d="m384-377 50.079-108.921L543-536l-108.921-50.079L384-695l-50.079 108.921L225-536l108.921 50.079L384-377Zm0 145-95-209-209-95 209-95 95-209 95 209 209 95-209 95-95 209Zm344 112-47-105-105-47 105-48 47-104 48 104 104 48-104 47-48 105ZM384-536Z" />
    </svg>
  );
};

export default MagicIcon;
