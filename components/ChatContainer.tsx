"use client";
import React, { useEffect, useRef, useState } from "react";
import { ExpandableChat, ExpandableChatFooter } from "@/components/ui/chat/expandable-chat";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage, ChatBubbleAction, ChatBubbleActionWrapper } from "@/components/ui/chat/chat-bubble";
import { ChatMessageList } from '@/components/ui/chat/chat-message-list'
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";


const initialMessage = [
  {
    id: 1,
    message: 'Hello, how has your day been? I hope you are doing well.',
    sender: 'user',
  },
  {
    id: 2,
    message: 'Hi, I am doing well, thank you for asking. How can I help you today?',
    sender: 'bot',
  },
  {
    id: 3,
    message: '',
    sender: 'bot',
    isLoading: true,
  },
];


export default function ChatContainer() {

  const [messages, setMessages] = useState(initialMessage);
  const [input, setInput] = useState<string>("");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = (event) => {
    event?.preventDefault();
    setMessages([
      ...messages,
      {
        id: messages?.length,
        message: event.target.value,
        sender: 'user',
      }
    ]);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;

    setMessages((messages) => [
      ...messages,
      {
        id: messages.length + 1,
        // name: selectedUser.name,
        // role: "user",
        message: input,
        sender: 'user',
      },
    ]);

    setInput("");
    formRef.current?.reset();
  };

  return (
    <div>
      <ExpandableChat>
        <ChatMessageList ref={messagesContainerRef}>
          <AnimatePresence>
            {messages.map((message, index) => {
              const variant = message.sender === 'user' ? 'sent' : 'received';
              return (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                  transition={{
                    opacity: { duration: 0.1 },
                    layout: {
                      type: "spring",
                      bounce: 0.3,
                      duration: index * 0.05 + 0.2,
                    },
                  }}
                  style={{ originX: 0.5, originY: 0.5 }}
                  className="flex flex-col gap-[0.2rem] p-2"
                >
                  <ChatBubble key={message.id} variant={variant}>
                    <ChatBubbleAvatar fallback={variant === 'sent' ? 'US' : 'AI'} />
                    <ChatBubbleMessage isLoading={message.isLoading}>
                      {message.message}
                    </ChatBubbleMessage>
                    {/* Action Icons */}
                    {/* <ChatBubbleActionWrapper>
                  {actionIcons.map(({ icon: Icon, type }) => (
                    <ChatBubbleAction
                      className="size-7"
                      key={type}
                      icon={<Icon className="size-4" />}
                      onClick={() => console.log('Action ' + type + ' clicked for message ' + index)}
                    />
                  ))}
                </ChatBubbleActionWrapper> */}
                  </ChatBubble>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </ChatMessageList>
        <ExpandableChatFooter>

          <form
            className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
            onSubmit={handleSendMessage}
            ref={formRef}
          >
            <ChatInput
              placeholder="Type your message here..."
              className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              ref={inputRef}
            />
            <div className="flex items-center p-3 pt-0">

              <Button
                size="sm"
                className="ml-auto gap-1.5 bg-[#000]"
              >
                Send Message
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </ExpandableChatFooter>
      </ExpandableChat>
    </div>
  );
}