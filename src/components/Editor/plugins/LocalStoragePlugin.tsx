import * as React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { debounce } from "@/utils/debounce";

type LocalStoragePluginProps = {
  namespace: string;
};

const LocalStoragePlugin: React.FC<LocalStoragePluginProps> = ({
  namespace,
}) => {
  const [editor] = useLexicalComposerContext();

  const saveContent = React.useCallback(
    (content: string) => {
      localStorage.setItem(namespace, content);
    },
    [namespace]
  );

  const debouncedSaveContent = debounce(saveContent, 500);

  React.useEffect(() => {
    return editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        // Don't update if nothing changed
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

        const serializedState = JSON.stringify(editorState);
        debouncedSaveContent(serializedState);
      }
    );
  }, [debouncedSaveContent, editor]);

  return null;
};

export default LocalStoragePlugin;
