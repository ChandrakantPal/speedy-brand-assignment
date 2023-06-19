import React from "react";
import MagicIcon from "./icons/MagicIcon";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 z-20 w-full bg-orange-400 shadow">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
        <Link href={"/"} className="flex items-center">
          <MagicIcon />
          <span className="self-center text-2xl font-semibold text-white whitespace-nowrap">
            AI
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
