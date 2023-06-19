import * as React from "react";
import { Tab } from "@headlessui/react";
import { Inter } from "next/font/google";
import topicsData from "../static/data.json";
import classNames from "classnames";
import Badge from "@/components/Badge";
import Modal from "@/components/Modal";
import AddTopicForm from "@/components/AddTopicForm";
import Editor from "@/components/Editor/Editor";
import PencilIcon from "@/components/icons/PencilIcon";
import AddIcon from "@/components/icons/AddIcon";
import DeleteIcon from "@/components/icons/DeleteIcon";
import TopicAndKeywords from "@/components/TopicAndKeywords";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export type Categories = "Custom" | "ICP" | "Mission" | "Product" | "ALL";
export interface Topic {
  topic: string;
  keywords: string[];
  category: Omit<"ALL", Categories>;
  id: string;
}

const categories: Categories[] = ["ALL", "Custom", "ICP", "Mission", "Product"];

export default function Home() {
  const [selectedCategory, setSelectedCategory] =
    React.useState<Categories>("ALL");
  const [allTopics, setAllTopics] = React.useState<Topic[]>(topicsData);
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [openAddTopicModal, setOpenAddTopicModal] = React.useState(false);
  const [openEditorModal, setOpenEditorModal] = React.useState(false);
  const [writeTopic, setWriteTopic] = React.useState<Topic | null>(null);

  React.useEffect(() => {
    if (selectedCategory === "ALL") {
      setTopics(allTopics);
    } else {
      const topicsWithSelectedCategory = allTopics.filter(
        (topic) => topic.category === selectedCategory
      );
      setTopics(topicsWithSelectedCategory);
    }
  }, [allTopics, selectedCategory]);

  const addNewTopic = (topic: Topic) => {
    setAllTopics((currentTopics) => [...currentTopics, topic]);
  };

  const removeTopic = (topic: Topic) => {
    const currentAllTopics = [...allTopics];
    const updatedAllTopics = currentAllTopics.filter(
      (item) => item.id !== topic.id
    );
    setAllTopics(updatedAllTopics);
  };

  return (
    <main
      className={`flex text-sm lg:text-base min-h-screen flex-col items-center justify-between lg:px-24 px-6 py-10 mt-16 ${inter.className}`}
    >
      <div className="w-full max-w-full px-2 space-y-4 lg:max-w-3xl sm:px-0">
        <div>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 ml-auto text-orange-500 border border-orange-500 rounded-lg hover:text-white hover:bg-orange-500"
            onClick={() => {
              setOpenAddTopicModal(true);
            }}
          >
            Add Topic
            <AddIcon />
          </button>
        </div>
        <Tab.Group>
          <Tab.List className="flex p-1 space-x-1 rounded-xl bg-blue-900/20">
            {categories.map((category) => (
              <Tab
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                }}
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                    selected
                      ? "bg-white shadow"
                      : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="space-y-4">
            <div className="p-3 bg-gray-100 rounded-lg">Recommended Topics</div>
            {topics.map((item) => (
              <div
                key={item.id}
                className={classNames(
                  "bg-white p-3 border rounded-lg",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                )}
              >
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                  <TopicAndKeywords
                    topic={item.topic}
                    keywords={item.keywords}
                  />
                  <div className="flex items-center gap-2 ">
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 border rounded-lg md:border-0 hover:bg-green-500/80 hover:text-white"
                      onClick={() => {
                        setWriteTopic(item);
                        setOpenEditorModal(true);
                      }}
                    >
                      <span className="md:hidden">Write</span>
                      <PencilIcon />
                    </button>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 border rounded-lg md:border-0 hover:bg-red-500/80 hover:text-white "
                      onClick={() => {
                        removeTopic(item);
                      }}
                    >
                      <span className="md:hidden">Delete</span>
                      <DeleteIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
      {openAddTopicModal && (
        <Modal
          open={openAddTopicModal}
          onClose={() => {
            setOpenAddTopicModal(false);
          }}
        >
          <AddTopicForm
            addNewTopic={addNewTopic}
            closeModal={() => {
              setOpenAddTopicModal(false);
            }}
          />
        </Modal>
      )}
      {openEditorModal && (
        <Modal
          open={openEditorModal}
          onClose={() => {
            setOpenEditorModal(false);
          }}
        >
          {writeTopic && <Editor topic={writeTopic} />}
        </Modal>
      )}
    </main>
  );
}
