import * as React from "react";
import InputFiled from "./InputFiled";
import { RadioGroup } from "@headlessui/react";
import { Categories, Topic } from "@/pages";
import CheckIcon from "./icons/CheckIcon";

interface AddTopicFormProps {
  addNewTopic: (topic: Topic) => void;
  closeModal: () => void;
}

const categories = ["Custom", "ICP", "Mission", "Product"];

const AddTopicForm: React.FC<AddTopicFormProps> = ({
  addNewTopic,
  closeModal,
}) => {
  const [topic, setTopic] = React.useState("");
  const [keywordsList, setKeywordsList] = React.useState<string[]>([]);
  const [keyword, setKeyword] = React.useState("");
  const [selectedCategory, setSelectedCategory] =
    React.useState<Omit<"ALL", Categories>>("Custom");
  const [keywordsError, setKeywordsError] = React.useState("");
  const [topicError, setTopicError] = React.useState("");

  const handleTagRemove = (key: string) => {
    // Remove the key from the array
    const updatedTags = keywordsList.filter((item) => item !== key);
    setKeywordsList(updatedTags);
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (topic === "") {
      setTopicError("Topic is required");
      return;
    }
    if (keywordsList.length === 0) {
      setKeywordsError("Please Add some keywords");
      return;
    }

    console.log({
      topic,
      keywords: keywordsList,
      category: selectedCategory,
    });

    addNewTopic({
      topic,
      keywords: keywordsList,
      category: selectedCategory,
      id: crypto.randomUUID(),
    });
    setKeywordsError("");
    setTopicError("");
    setTopic("");
    setKeyword("");
    setKeywordsList([]);
    closeModal();
  };

  return (
    <form className="w-full space-y-4" onSubmit={submitHandler}>
      <h6 className="mx-auto text-lg font-semibold text-gray-900 w-fit">
        Add Topics
      </h6>
      <div className="space-y-2">
        <label
          htmlFor="Topic"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Topic*
        </label>
        <InputFiled
          type="text"
          id="topic"
          placeholder="Enter Topic"
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
          }}
          onBlur={() => {
            setTopicError("");
          }}
        />
        {topicError && <small className="text-red-500">{topicError}</small>}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="Topic"
          className="block mb-2 text-sm font-medium text-gray-900 "
        >
          Keywords*
        </label>

        <InputFiled
          type="text"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          onBlur={() => {
            setKeywordsError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && keyword) {
              e.preventDefault();
              // Add the tag to the array
              setKeywordsList([...keywordsList, keyword]);
              setKeyword("");
            }
          }}
          placeholder="Add Keywords..."
        />
        {keywordsError ? (
          <small className="text-red-500">{keywordsError}</small>
        ) : (
          <small>
            Please Press{" "}
            <span className="bg-gray-300 rounded-md py-0.5 px-1">return</span>{" "}
            or <span className="bg-gray-300 rounded-md py-0.5 px-1">enter</span>{" "}
            to add keyword to the list
          </small>
        )}
        <div className="flex flex-wrap">
          {keywordsList.map((item) => (
            <div
              key={item}
              className="px-2 py-1 mt-2 mr-2 text-gray-800 bg-gray-200 rounded-lg"
            >
              {item}
              <button
                className="ml-2 focus:outline-none"
                onClick={() => handleTagRemove(item)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
      <RadioGroup value={selectedCategory} onChange={setSelectedCategory}>
        <RadioGroup.Label className="mb-2 text-sm font-medium text-gray-900">
          Category*
        </RadioGroup.Label>
        <div className="grid items-center grid-cols-2 gap-2 ">
          {categories.map((item) => (
            <RadioGroup.Option
              key={item}
              value={item}
              className={({ checked }) =>
                `
                  ${checked ? "bg-green-500/10  border-green-500 " : "bg-white"}
                    relative flex flex-wrap cursor-pointer rounded-lg px-2 py-2 border outline-none`
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
                        <CheckIcon className="w-6 h-6" />
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
        type="submit"
        className="block px-4 py-1 ml-auto text-white bg-orange-400 rounded-lg"
      >
        Submit
      </button>
    </form>
  );
};

export default AddTopicForm;
