import * as React from "react";

const Badge: React.FC<{ title: string; noColour?: boolean }> = ({
  title,
  noColour = false,
}) => {
  const brightColors = [
    "bg-red-500/10 text-red-500 border-red-500", // Red
    "bg-orange-500/10 text-orange-500 border-orange-500", // Orange
    "bg-yellow-500/10 text-yellow-500 border-yellow-500", // Yellow
    "bg-green-500/10 text-green-500 border-green-500", // Green
    "bg-cyan-500/10 text-cyan-500 border-cyan-500", // Cyan
    "bg-blue-500/10 text-blue-500 border-blue-500", // Blue
    "bg-amber-500/10 text-amber-500 border-amber-500", // Amber
    // extend the colors
  ];

  const randomIndex = React.useMemo(
    () => Math.floor(Math.random() * brightColors.length),
    [brightColors.length]
  );

  return (
    <div
      className={`border px-2 py-1 text-center rounded-lg ${
        noColour
          ? "bg-gray-200 text-gray-900 border-gray-900"
          : brightColors[randomIndex]
      }`}
    >
      {title}
    </div>
  );
};

export default Badge;
