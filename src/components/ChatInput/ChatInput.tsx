import React from "react";
import { useForm } from "react-hook-form";
import { IoArrowUp } from "react-icons/io5";

const ChatInput = ({ onSubmit, isLoading }) => {
  const { register, handleSubmit, reset } = useForm();

  const handlePromptSubmit = (data: any) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="p-5 bg-white rounded-3xl border-gray-200">
      <form
        onSubmit={handleSubmit(handlePromptSubmit)}
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
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(handlePromptSubmit)();
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoArrowUp size={20} className="text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
