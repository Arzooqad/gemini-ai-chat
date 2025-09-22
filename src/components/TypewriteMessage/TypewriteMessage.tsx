import React from "react";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { TypewriteMessageProps } from "../../types/ChatTypes";

const TypewriteMessage = ({
  content,
  shouldTypewrite,
  onScroll,
}: TypewriteMessageProps) => {
  const [displayedContent, setDisplayedContent] = useState(
    shouldTypewrite ? "" : content
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!shouldTypewrite) {
      setDisplayedContent(content);
      return;
    }

    if (currentIndex < content.length) {
      const timer = requestAnimationFrame(() => {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        setCurrentIndex((prev) => prev + 1);
        onScroll();
      });

      return () => cancelAnimationFrame(timer);
    }
  }, [content, currentIndex, shouldTypewrite, onScroll]);

  useEffect(() => {
    if (shouldTypewrite) {
      setCurrentIndex(0);
      setDisplayedContent("");
    }
  }, [content, shouldTypewrite]);

  return (
    <div className="text-sm leading-relaxed">
      <Markdown>{displayedContent}</Markdown>
    </div>
  );
};

export default TypewriteMessage;
