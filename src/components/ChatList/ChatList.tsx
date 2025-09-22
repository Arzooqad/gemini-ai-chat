import React, { useCallback, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../../contants";
import classNames from "classnames";
import Markdown from "react-markdown";
import { ChatMessageProps, MessageForm } from "../../types/ChatTypes";
import { LuUsers } from "react-icons/lu";
import Avatar from "../Avatar/Avatar";
import { ImSpinner8 } from "react-icons/im";
import ChatInput from "../ChatInput/ChatInput";
import TypewriteMessage from "../TypewriteMessage/TypewriteMessage";

const ChatList = () => {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typewriteMessageId, setTypewriteMessageId] = useState<string | null>(
    null
  );
  const { reset } = useForm<MessageForm>();
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const onSubmit = useCallback(
    async (data: MessageForm) => {
      if (!data.prompt.trim()) return;

      const userMessage: ChatMessageProps = {
        id: Date.now().toString(),
        content: data.prompt,
        isUser: true,
      };

      setTypewriteMessageId(null);
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      reset();

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash-001",
          contents: data.prompt,
        });

        const aiMessageId = crypto.randomUUID();
        const aiMessage: ChatMessageProps = {
          id: aiMessageId,
          content: response.text || "",
          isUser: false,
        };

        setMessages((prev) => [...prev, aiMessage]);
        setTypewriteMessageId(aiMessageId);
        setIsLoading(false);
      } catch (error) {
        const errorMessageId = crypto.randomUUID();
        const errorMessage: ChatMessageProps = {
          id: errorMessageId,
          content: error.message || "Sorry, Something went wrong. Please try again.",
          isUser: false,
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
      }
    },
    [reset]
  );

  return (
    <div className="flex flex-col md:mx-[8%] xl:mx-[20%] md:mb-8 rounded-b-3xl h-screen md:h-[calc(100vh-7rem)] bg-gradient-to-br from-purple-50 to-[#fffff5]">
      <div className="flex-1 overflow-y-auto p-6 my-4">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={classNames("flex mb-4", {
              "justify-end": message.isUser,
              "justify-start": !message.isUser,
            })}
          >
            <div className="flex items-start gap-3 max-w-lg lg:max-w-3xl">
              {!message.isUser && <Avatar icon={LuUsers} />}
              <div
                className={classNames(
                  "px-4 py-3 rounded-2xl max-w-lg lg:max-w-3xl",
                  {
                    "bg-gray-100 text-gray-900": message.isUser,
                    "bg-white text-gray-900 shadow-sm border border-gray-200":
                      !message.isUser,
                  }
                )}
              >
                {message.isUser ? (
                  <div className="text-sm leading-relaxed">
                    <Markdown>{message.content}</Markdown>
                  </div>
                ) : (
                  <TypewriteMessage
                    content={message.content}
                    shouldTypewrite={message.id === typewriteMessageId}
                  />
                )}
              </div>
              {message.isUser && <Avatar text="A" />}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-x-3 max-w-xs lg:max-w-lg">
              <Avatar icon={LuUsers} />
              <div className="px-4 py-3 rounded-2xl bg-white text-gray-900 shadow-sm border border-gray-200">
                <ImSpinner8 className="animate-spin" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
};

export default ChatList;
