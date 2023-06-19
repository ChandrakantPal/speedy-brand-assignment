import { RefObject, useEffect } from "react";

const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T> | null,
  callBack: () => void
) => {
  useEffect(() => {
    const element = ref?.current;

    function handleClickOutside(event: Event) {
      if (element && !element.contains(event.target as Node | null)) {
        callBack();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callBack]);
};

export default useClickOutside;
