import * as React from "react";
/**
 * Detect if the user currently presses a mouse button or key.
 */

const useUserInteractions = () => {
  const [isPointerDown, setIsPointerDown] = React.useState(false);
  const [isKeyDown, setIsKeyDown] = React.useState(false);

  React.useEffect(() => {
    const handlePointerUp = () => {
      setIsPointerDown(false);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    const handlePointerDown = () => {
      setIsPointerDown(true);
      document.addEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  React.useEffect(() => {
    const handleKeyUp = () => {
      setIsKeyDown(false);
      document.removeEventListener("keyup", handleKeyUp);
    };

    const handleKeyDown = () => {
      setIsKeyDown(true);
      document.addEventListener("keyup", handleKeyUp);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return { isPointerDown, isKeyDown };
};

export default useUserInteractions;
