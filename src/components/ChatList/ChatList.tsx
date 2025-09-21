import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../../contants";
import { IoArrowUp } from "react-icons/io5";
import classNames from "classnames";
import Markdown from "react-markdown";
import { ChatMessage, MessageForm } from "../../types/ChatTypes";
import { useAnimatedText } from "../../hooks/UseAnimateText";
import { FaCircle, FaSpinner } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import Avatar from "../Avatar/Avatar";
import { ImSpinner8 } from "react-icons/im";

const ChatList = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageForm>();

  const onSubmit = async (data: MessageForm) => {
    if (!data.prompt.trim()) return;

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: data.prompt,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingMessage("");
    setIsStreaming(false);
    reset();

    try {
      const response = await ai.models.generateContentStream({
        model: "gemini-2.0-flash-001",
        contents: data.prompt,
      });

      let fullResponse = "";

      for await (const chunk of response) {
        if (chunk.text) {
          fullResponse += chunk.text;
        }
      }

      setIsLoading(false);
      setIsStreaming(true);
      setStreamingMessage(fullResponse);

      const words = fullResponse.split(" ");
      const animationDuration = Math.max(words.length * 0.1, 2) * 1000;

      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: fullResponse,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        setStreamingMessage("");
        setIsStreaming(false);
      }, animationDuration);
    } catch (error) {
      console.error("Error generating content:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
      setIsStreaming(false);
      setStreamingMessage("");
    }
  };

  const AnimatedMessage = ({ content }: { content: string }) => {
    const animatedContent = useAnimatedText(content, 3);

    return (
      <div className="text-sm leading-relaxed">
        <Markdown>{animatedContent}</Markdown>
      </div>
    );
  };

  return (
    <div className="flex flex-col mx-[20%] my-8 rounded-3xl h-[calc(100vh-4rem)] bg-gradient-to-br from-purple-50 to-[#fffff5]">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={classNames("flex", {
              "justify-end": message.isUser,
              "justify-start": !message.isUser,
            })}
          >
            <div className="flex items-start space-x-3 max-w-xs lg:max-w-lg">
              {!message.isUser && <Avatar icon={LuUsers} />}
              <div
                className={classNames("px-4 py-3 rounded-2xl", {
                  "bg-gray-100 text-gray-900": message.isUser,
                  "bg-white text-gray-900 shadow-sm border border-gray-200":
                    !message.isUser,
                })}
              >
                <p className="text-sm leading-relaxed">
                  <Markdown>{message.content}</Markdown>
                </p>
              </div>
              {message.isUser && <Avatar text="K" />}
            </div>
          </div>
        ))}

        {(isLoading || isStreaming) && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-xs lg:max-w-lg">
              <Avatar icon={LuUsers} />
              <div className="px-4 py-3 rounded-2xl bg-white text-gray-900 shadow-sm border border-gray-200">
                {isLoading ? (
                  <ImSpinner8 className="animate-spin" />
                ) : (
                  <AnimatedMessage content={streamingMessage} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 bg-white rounded-3xl border-gray-200">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center justify-center"
        >
          <div className="w-full relative">
            <textarea
              {...register("prompt", {
                required: "Message cannot be empty",
              })}
              placeholder="Message HR Assistant..."
              className="w-full px-6 py-4 pr-16 bg-gray-100 rounded-[1.875rem] border border-gray-300 focus:outline-none transition-colors text-gray-700 placeholder-gray-400 shadow-sm resize-none overflow-hidden"
              rows={2}
            />
            <button
              type="submit"
              disabled={isLoading || isStreaming}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IoArrowUp size={20} className="text-white" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatList;
