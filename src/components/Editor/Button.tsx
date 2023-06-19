import * as React from "react";

const Button: React.FC<
  React.PropsWithChildren<
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
  >
> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      type="button"
      className="inline-flex justify-center px-2 py-1 text-sm font-medium border border-transparent rounded-md cursor-pointer bg-slate-100 text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
    >
      {children}
    </button>
  );
};

export default Button;
