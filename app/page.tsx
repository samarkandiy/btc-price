'use client';
import { useChat } from 'ai/react';
import { useState, useRef, useEffect } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null); // Add type assertion here

  const handleSubmitWithLoadingIndicator = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowLoadingIndicator(true);
    await handleSubmit(e);
    setShowLoadingIndicator(false);
  };

  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages, showLoadingIndicator]);

  return (
    <>
      <h1 className="fixed top-[10px] text-2xl p-4 font-bold">GPT</h1>
      <div className="flex-col w-full py-20 mx-auto stretch flex h-screen">
        <div className="flex-1 overflow-y-auto" ref={messagesContainerRef}>
          <div className="flex flex-col">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${
                  m.role === 'user' ? 'flex items-end justify-end' : 'flex items-start justify-start'
                } p-4`}
              >
                {m.role === 'user' ? (
                  <div className="user__message max-w-xs px-4 py-2 text-white bg-[#3375F7] rounded-xl whitespace-pre-wrap">
                    {m.content}
                  </div>
                ) : (
                  <div className="ai__message max-w-xs px-4 py-2 text-gray-700 bg-[#E9E9EB] rounded-xl whitespace-pre-wrap">
                    {m.content}
                  </div>
                )}
              </div>
            ))}
            {showLoadingIndicator && (
              <div className="flex items-start justify-start p-4">
                <div className="ai__message max-w-xs px-4 py-2 text-gray-700 bg-[#E9E9EB] rounded-xl whitespace-pre-wrap">
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="fixed bottom-0 w-[465px] max-w-[100%]">
          <form className="flex w-full p-4 space-x-4" onSubmit={handleSubmitWithLoadingIndicator}>
            <input
              type="text"
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              placeholder="Ask questions..."
              onChange={handleInputChange}
            />
            <button
              className="px-4 py-2 text-white bg-[#3375F7] rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isLoading}
            >
              <span className='inline-block'>
                {isLoading ? 'Typing' : 'Send'}
                {isLoading && <span className="relative typing-dots"></span>}
              </span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
