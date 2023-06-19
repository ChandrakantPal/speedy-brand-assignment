import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { $getSelection, FORMAT_TEXT_COMMAND, LexicalEditor } from "lexical";
import { computePosition } from "@floating-ui/dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { IconButton } from "../../IconButton";

import { $isRangeSelected } from "@/utils/$isRangeSelected";
import useUserInteractions from "../hooks/useUserInteractions";

type FloatingMenuPosition = { x: number; y: number } | undefined;

type FloatingMenuProps = {
  editor: LexicalEditor;
  show: boolean;
  isBold: boolean;
  isCode: boolean;
  isItalic: boolean;
  isStrikethrough: boolean;
  isUnderline: boolean;
};

// const Headers: HeadingTagType[] = ["h1", "h2", "h3"];

const FloatingMenu: React.FC<FloatingMenuProps> = ({ show, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<FloatingMenuPosition>(undefined);

  const nativeSel = window.getSelection();

  useEffect(() => {
    const isCollapsed = nativeSel?.rangeCount === 0 || nativeSel?.isCollapsed;

    if (!show || !ref.current || !nativeSel || isCollapsed) {
      setPos(undefined);
      return;
    }
    const domRange = nativeSel.getRangeAt(0);

    computePosition(domRange, ref.current, { placement: "top" })
      .then((pos) => {
        setPos({ x: pos.x, y: pos.y - 10 });
      })
      .catch(() => {
        setPos(undefined);
      });
    // anchorOffset, so that we sync the menu position with
    // native selection (if user selects two ranges consecutively)
  }, [show, nativeSel, nativeSel?.anchorOffset]);

  return (
    <div
      ref={ref}
      style={{ top: pos?.y, left: pos?.x }}
      aria-hidden={!pos?.x || !pos?.y}
      className={`absolute z-[100] flex items-center justify-between bg-slate-100 border border-slate-300 rounded-md p-1 gap-1 ${
        pos?.x && pos.y ? "opacity-1 visible" : "opacity-0 invisible"
      }`}
    >
      {/* {Headers.map((item) => {
        return (
          <button
            type="button"
            className="py-[1px] px-1 rounded-sm cursor-pointer bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
            onClick={() => {
              props.editor.update(() => {
                const selection = $getSelection();

                if ($isRangeSelected(selection)) {
                  $setBlocksType(selection, () => $createHeadingNode(item));
                }
              });
            }}
            key={item}
          >
            {item}
          </button>
        );
      })} */}

      <IconButton
        icon="bold"
        aria-label="Format text as bold"
        active={props.isBold}
        onClick={() => {
          props.editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
      />
      <IconButton
        icon="italic"
        aria-label="Format text as italics"
        active={props.isItalic}
        onClick={() => {
          props.editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
      />
      <IconButton
        icon="underline"
        aria-label="Format text to underlined"
        active={props.isUnderline}
        onClick={() => {
          props.editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
      />
      <IconButton
        icon="strike"
        aria-label="Format text with a strikethrough"
        active={props.isStrikethrough}
        onClick={() => {
          props.editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
      />
      <IconButton
        icon="code"
        aria-label="Format text with inline code"
        active={props.isCode}
        onClick={() => {
          props.editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        }}
      />
    </div>
  );
};

export function FloatingMenuPlugin() {
  const [show, setShow] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const { isPointerDown, isKeyDown } = useUserInteractions();
  const [editor] = useLexicalComposerContext();

  const updateFloatingMenu = useCallback(() => {
    editor.getEditorState().read(() => {
      if (editor.isComposing() || isPointerDown || isKeyDown) return;

      if (editor.getRootElement() !== document.activeElement) {
        setShow(false);
        return;
      }

      const selection = $getSelection();

      if ($isRangeSelected(selection)) {
        const nodes = selection.getNodes();
        setIsBold(selection.hasFormat("bold"));
        setIsCode(selection.hasFormat("code"));
        setIsItalic(selection.hasFormat("italic"));
        setIsUnderline(selection.hasFormat("underline"));
        setIsStrikethrough(selection.hasFormat("strikethrough"));
        setShow(true);
      } else {
        setShow(false);
      }
    });
  }, [editor, isPointerDown, isKeyDown]);

  // Rerender the floating menu automatically on every state update.
  // Needed to show correct state for active formatting state.
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      updateFloatingMenu();
    });
  }, [editor, updateFloatingMenu]);

  // Rerender the floating menu on relevant user interactions.
  // Needed to show/hide floating menu on pointer up / key up.
  useEffect(() => {
    updateFloatingMenu();
  }, [isPointerDown, isKeyDown, updateFloatingMenu]);

  if (typeof window === "object") {
    return createPortal(
      <FloatingMenu
        editor={editor}
        show={show}
        isBold={isBold}
        isCode={isCode}
        isItalic={isItalic}
        isStrikethrough={isStrikethrough}
        isUnderline={isUnderline}
      />,
      window.document.body
    );
  }

  return null;
}
