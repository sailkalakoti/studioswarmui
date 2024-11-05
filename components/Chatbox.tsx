"use client"

import * as React from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
}

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([
    { id: 1, text: "Hello! How can I help you today?", sender: "bot" },
  ])
  const [inputValue, setInputValue] = React.useState("")
  const { theme } = useTheme()

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputValue,
        sender: "user",
      }
      setMessages([...messages, newMessage])
      setInputValue("")

      // Simulate bot response
      setTimeout(() => {
        const botResponse: Message = {
          id: messages.length + 2,
          text: "Thank you for your message. Our team will get back to you soon.",
          sender: "bot",
        }
        setMessages((prevMessages) => [...prevMessages, botResponse])
      }, 1000)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-80 bg-white dark:bg-blue-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-blue-900 dark:text-white">
                <CardTitle className="text-sm font-medium">Chat Support</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close chat</span>
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full pr-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-blue-100"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex w-full items-center space-x-2"
                >
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="bg-blue-50 dark:bg-blue-800 dark:text-white"
                  />
                  <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                    <Send className="h-4 w-4 text-white" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              className="h-12 rounded-full px-4 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setIsOpen(true)}
            >
              <MessageCircle className="h-6 w-6" />
              <span>Chat</span>
              <span className="sr-only">Open chat</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}