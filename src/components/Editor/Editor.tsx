/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { TRANSFORMERS } from "@lexical/markdown";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import { Topic } from "@/pages";

import LocalStoragePlugin from "./plugins/LocalStoragePlugin";
import ActionsPlugin from "./plugins/ActionsPlugin";
import {
  EditorHistoryStateContext,
  useEditorHistoryState,
} from "./context/EditorHistoryState";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { FloatingMenuPlugin } from "./plugins/FloatingMenu";
import Badge from "../Badge";
import { RadioGroup } from "@headlessui/react";
import CheckIcon from "../icons/CheckIcon";
import { openai } from "@/lib/openai";
import MagicIcon from "../icons/MagicIcon";
import Loader from "../Loader";
import ImagesPlugin from "./plugins/ImagePlugin";
import { ImageNode } from "./nodes/ImageNode";

type LexicalEditorProps = {
  config: Parameters<typeof LexicalComposer>["0"]["initialConfig"];
};

const EDITOR_NODES = [
  CodeNode,
  HeadingNode,
  LinkNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  ImageNode,
];

type Tone = "Professional" | "Creative" | "Engaging" | "Collaborative";
const ToneList: Tone[] = [
  "Professional",
  "Creative",
  "Engaging",
  "Collaborative",
];

const LexicalEditor = (props: LexicalEditorProps) => {
  const { historyState } = useEditorHistoryState();
  return (
    <LexicalComposer initialConfig={props.config}>
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<Placeholder />}
        ErrorBoundary={LexicalErrorBoundary}
      />

      <HistoryPlugin externalHistoryState={historyState} />
      <LocalStoragePlugin namespace={props.config.namespace} />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <ActionsPlugin />
      <FloatingMenuPlugin />
      <ImagesPlugin />
    </LexicalComposer>
  );
};

const Placeholder = () => {
  return (
    <div className="absolute top-[1.125rem] left-[1.125rem] opacity-50">
      Start writing...
    </div>
  );
};

const Editor: React.FC<{ topic: Topic }> = ({ topic }) => {
  const [tone, setTone] = React.useState<Tone>("Professional");
  const [generatedImage, setGeneratedImage] = React.useState("");
  const [generatedText, setGeneratedText] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const EDITOR_NAMESPACE = React.useMemo(
    () => `${topic.topic}-editor`,
    [topic]
  );
  const content = localStorage.getItem(EDITOR_NAMESPACE);

  const generateContent = async () => {
    try {
      setLoading(true);
      const text = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Generate blog Content in ${tone} tone for the topic "${
          topic.topic
        }" and has the have these keywords: ${topic.keywords.map(
          (keyword) => keyword
        )}`,
      });
      const image = await openai.createImage({
        prompt: `Generate Image for the topic '${topic.topic}'`,
        n: 1,
        size: "512x512",
      });
      if (image?.data?.data?.[0]?.url) {
        setGeneratedImage(image?.data?.data[0]?.url);
      }
      if (text.data.choices?.[0].text) {
        setGeneratedText(text.data.choices[0].text);
      }
      setLoading(false);
    } catch (error) {
      setErrorMessage("Couldn't generate the content");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {generatedText || generatedImage ? (
        <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow">
          <img
            className="rounded-t-lg"
            src={generatedImage}
            alt="Generated Image"
          />
          <div className="p-5">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              Generated Content
            </h5>
            <p className="mb-3 font-normal text-gray-700 ">{generatedText}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h6>{topic.topic}</h6>
          <div className="flex flex-wrap items-center gap-2">
            {topic.keywords.map((item) => (
              <Badge noColour key={item} title={item} />
            ))}
          </div>
          <RadioGroup value={tone} onChange={setTone}>
            <RadioGroup.Label className="mb-2 text-sm font-medium text-gray-900">
              Select Tone
            </RadioGroup.Label>
            <div className="grid items-center grid-cols-2 gap-2 ">
              {ToneList.map((item) => (
                <RadioGroup.Option
                  key={item}
                  value={item}
                  className={({ checked }) =>
                    `
                  ${checked ? "bg-green-500/10  border-green-500 " : "bg-white"}
                    relative flex flex-wrap gap-x-2 cursor-pointer rounded-lg px-2 py-2 border outline-none`
                  }
                >
                  {({ checked }) => (
                    <>
                      <div className="flex items-center justify-between w-full">
                        <RadioGroup.Label
                          as="p"
                          className={`font-medium   ${
                            checked ? "text-green-500" : "text-gray-900"
                          }`}
                        >
                          {item}
                        </RadioGroup.Label>

                        {checked && (
                          <div className="ml-auto text-green-500 bg-green-500 rounded-full shrink-0">
                            <CheckIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
          <button
            className="flex items-center gap-2 px-4 py-2 ml-auto text-white bg-green-500 rounded-lg"
            onClick={generateContent}
          >
            Generate Content
            <MagicIcon />
          </button>
          {errorMessage && (
            <small className="text-red-500">{errorMessage}</small>
          )}
        </div>
      )}
      <div className="inline-flex items-center justify-center w-full">
        <hr className="w-full h-px my-8 bg-gray-200 border-0" />
        <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 ">
          or
        </span>
      </div>

      <h6 className="text-lg font-medium">Write yourself</h6>
      <div
        id="editor-wrapper"
        className={
          "relative prose prose-slate prose-p:my-0 prose-headings:mb-4 prose-headings:mt-2"
        }
      >
        <EditorHistoryStateContext>
          <LexicalEditor
            config={{
              namespace: EDITOR_NAMESPACE,
              nodes: EDITOR_NODES,
              editorState: content,
              theme: {
                root: "p-4 border-slate-500 border-2 rounded h-full min-h-[200px] focus:outline-none focus-visible:border-black",
                link: "cursor-pointer",
                text: {
                  bold: "font-semibold",
                  underline: "underline",
                  italic: "italic",
                  strikethrough: "line-through",
                  underlineStrikethrough: "underlined-line-through",
                },
              },
              onError: (error) => {
                console.log(error);
              },
            }}
          />
        </EditorHistoryStateContext>
      </div>
    </div>
  );
};

export default Editor;
