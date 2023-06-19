import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import {
  $getRoot,
  $isParagraphNode,
  CLEAR_EDITOR_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import RemoveIcon from "@/components/icons/RemoveIcon";
import UndoIcon from "@/components/icons/UndoIcon";
import { useEditorHistoryState } from "../context/EditorHistoryState";
import RedoIcon from "@/components/icons/RedoIcon";
import Button from "../Button";

const ActionsPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const { historyState } = useEditorHistoryState();

  const [isEditorEmpty, setIsEditorEmpty] = React.useState(true);

  const { undoStack, redoStack } = historyState ?? {};
  const [hasUndo, setHasUndo] = React.useState(undoStack?.length !== 0);
  const [hasRedo, setHasRedo] = React.useState(redoStack?.length !== 0);

  React.useEffect(
    function checkEditorEmptyState() {
      return editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const root = $getRoot();
          const children = root.getChildren();

          if (children.length > 1) {
            setIsEditorEmpty(false);
            return;
          }

          if ($isParagraphNode(children[0])) {
            setIsEditorEmpty(children[0].getChildren().length === 0);
          } else {
            setIsEditorEmpty(false);
          }
        });
      });
    },
    [editor]
  );

  React.useEffect(
    function checkEditorHistoryActions() {
      return editor.registerUpdateListener(() => {
        setHasRedo(redoStack?.length !== 0);
        setHasUndo(undoStack?.length !== 0);
      });
    },
    [editor, undoStack, redoStack]
  );

  const MandatoryPlugins = React.useMemo(() => {
    return <ClearEditorPlugin />;
  }, []);

  return (
    <>
      {MandatoryPlugins}
      <div className="flex gap-3 my-4">
        <Button
          disabled={isEditorEmpty}
          onClick={() => {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
          }}
        >
          <RemoveIcon />
        </Button>
        <div className="flex gap-1">
          <Button
            disabled={!hasUndo}
            onClick={() => {
              editor.dispatchCommand(UNDO_COMMAND, undefined);
            }}
          >
            <UndoIcon />
          </Button>
          <Button
            disabled={!hasRedo}
            onClick={() => {
              editor.dispatchCommand(REDO_COMMAND, undefined);
            }}
          >
            <RedoIcon />
          </Button>
        </div>
      </div>
    </>
  );
};

export default ActionsPlugin;
