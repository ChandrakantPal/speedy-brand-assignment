import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $wrapNodeInElement, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  LexicalEditor,
} from "lexical";
import InputFiled from "@/components/InputFiled";

import { $createImageNode, ImageNode, ImagePayload } from "../nodes/ImageNode";
import ImageIcon from "@/components/icons/ImageIcon";

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND");

export function InsertImageUploadedForm({
  onClick,
}: {
  onClick: (payload: InsertImagePayload) => void;
}) {
  const [src, setSrc] = React.useState("");
  const [altText, setAltText] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isDisabled = src === "";

  const loadImage = (files: FileList | null) => {
    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === "string") {
        setSrc(reader.result);
      }
      return "";
    };
    if (files !== null) {
      reader.readAsDataURL(files[0]);
      setAltText(files[0].name);
    }
  };

  return (
    <div className="flex items-center gap-2 ">
      <button
        type="button"
        className="px-4 py-2 rounded-lg hover:border hover:bg-slate-200"
        onClick={() => {
          fileInputRef?.current?.click();
        }}
      >
        <ImageIcon />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        aria-label="Image Upload"
        onChange={(e) => loadImage(e.target.files)}
        accept="image/*"
        data-test-id="image-modal-file-upload"
        className="hidden"
      />
      <InputFiled
        type="text"
        aria-label="Alt Text"
        placeholder="Descriptive alternative text"
        onChange={(e) => {
          setAltText(e.target.value);
        }}
        value={altText}
        data-test-id="image-modal-alt-text-input"
      />
      <button
        data-test-id="image-modal-file-upload-btn"
        disabled={isDisabled}
        onClick={() => {
          onClick({ altText, src });
          setAltText("");
          setSrc("");
        }}
      >
        Add
      </button>
    </div>
  );
}

export function InsertImage({
  activeEditor,
}: {
  activeEditor: LexicalEditor;
}): JSX.Element {
  const hasModifier = React.useRef(false);

  React.useEffect(() => {
    hasModifier.current = false;
    const handler = (e: KeyboardEvent) => {
      hasModifier.current = e.altKey;
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [activeEditor]);

  const onClick = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
  };

  return <InsertImageUploadedForm onClick={onClick} />;
}

export default function ImagesPlugin({
  captionsEnabled,
}: {
  captionsEnabled?: boolean;
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error("ImagesPlugin: ImageNode not registered on editor");
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [captionsEnabled, editor]);

  return <InsertImage activeEditor={editor} />;
}
