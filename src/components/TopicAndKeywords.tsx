import * as React from "react";
import Badge from "./Badge";

const TopicAndKeywords: React.FC<{
  topic: string;
  keywords: string[];
}> = ({ topic, keywords }) => {
  return (
    <div>
      <h2>{topic}</h2>
      <ul className="flex flex-wrap items-center gap-2">
        {keywords.map((keyword, keywordIndex) => (
          <li key={keywordIndex}>
            <Badge title={keyword} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicAndKeywords;
