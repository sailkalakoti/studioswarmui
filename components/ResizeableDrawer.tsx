'use client'

import React, { useState, useRef, useEffect, Dispatch, SetStateAction } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Send, AlertCircle, Activity, Globe, User, Bot, Server, Maximize2, Minimize2, X } from 'lucide-react'
import { useApiMutation } from '@/lib/utils'

const BRAND_BLUE = '#0071B2';

export default function ResizableDrawer({ port, instanceId, onClose }: { port: number, instanceId: string, onClose: Function }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [width, setWidth] = useState(420);
  const [isDragging, setIsDragging] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const drawerRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)

  console.log({ port, instanceId })

  const toggleDrawer = () => setIsOpen(!isOpen)
  const toggleExpand = () => setIsExpanded(!isExpanded)

  const postChatMutation = useApiMutation('http://178.156.143.254:' + port + '/chat', 'POST', {
    onSuccess: (data: any) => {
      if (data?.response?.length > 0) {
        const newMessage = data?.response
          ?.filter(item => item?.content?.length && item?.role!== 'tool')
          ?.map(item => ({
            sender: item?.role === 'user' ? 'User' : 'Agent',
            message: item.content,
            name: item?.role === 'user' ? 'User' : item?.sender,
          }))
        setChatMessages(newMessage)
      }
    }
  })

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      setChatMessages([...chatMessages, { sender: 'User', message: inputMessage, name: "User" }])
      postChatMutation.mutate({
        "user_input": inputMessage,
        session_id: instanceId
      })
      setInputMessage('')
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const newWidth = document.body.clientWidth - e.clientX
      setWidth(Math.min(Math.max(280, newWidth), 600))
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'System':
        return <Server className="h-4 w-4" />
      case 'Agent':
        return <User className="h-4 w-4" />
      case 'User':
        return <User className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 flex top-[70px]">
      {isOpen && !isExpanded ? (
        <div
          ref={drawerRef}
          className="h-full bg-white dark:bg-gray-900 border-l shadow-lg flex flex-col relative"
          style={{ width: `${width}px` }}
        >
          <div
            ref={resizeHandleRef}
            className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500/50 transition-colors"
            onMouseDown={startResizing}
          />
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-lg">Chat</h2>
            <div className="flex gap-2">
              <Button
                onClick={toggleExpand}
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => {
                  setIsExpanded(false);
                  setIsOpen(false);
                  onClose();
                }}
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DrawerContent
            ref={messagesContainerRef}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            getSenderIcon={getSenderIcon}
            chatMessages={chatMessages}
            handleSendMessage={handleSendMessage}
          />
        </div>
      ) : isExpanded ? (
        <div className="fixed inset-0 z-50 bg-black/20">
          <div className="fixed inset-x-[12.5%] inset-y-[12.5%] bg-white dark:bg-gray-900 rounded-lg shadow-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-lg">Chat</h2>
              <div className="flex gap-2">
                <Button
                  onClick={toggleExpand}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => {
                    setIsExpanded(false);
                    setIsOpen(false);
                    onClose();
                  }}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <DrawerContent
              ref={messagesContainerRef}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              getSenderIcon={getSenderIcon}
              chatMessages={chatMessages}
              handleSendMessage={handleSendMessage}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

interface ChatMessageType {
  sender: string;
  message: string;
  name: string;
}

interface DrawerContentProps {
  chatMessages: ChatMessageType[];
  getSenderIcon: (sender: string) => React.JSX.Element;
  handleSendMessage: (e: React.FormEvent) => void;
  inputMessage: string,
  setInputMessage: Dispatch<SetStateAction<string>>,
}


const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ chatMessages, getSenderIcon, handleSendMessage, inputMessage, setInputMessage }, ref) => {
    return (
      <Tabs defaultValue="chat" className="flex-grow flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50/50 
        dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/10">
        <TabsList className="px-4 py-2 border-b border-blue-100/50 dark:border-blue-900/20 backdrop-blur-sm bg-white/30 dark:bg-black/30">
          <TabsTrigger 
            value="chat"
            className="px-6 py-2.5 rounded-full data-[state=active]:bg-[#0071B2] data-[state=active]:text-white 
            data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-200
            hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            Chat
          </TabsTrigger>
          <TabsTrigger 
            value="debug"
            className="px-6 py-2.5 rounded-full data-[state=active]:bg-[#0071B2] data-[state=active]:text-white 
            data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 transition-all duration-200
            hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            Debug
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-grow flex flex-col p-6 overflow-hidden">
          <ScrollArea className="flex-grow pr-4" ref={ref}>
            <div className="space-y-6">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'} 
                    animate-in slide-in-from-${msg.sender === 'User' ? 'right' : 'left'}`}
                >
                  <div className={`flex flex-col space-y-2 max-w-[80%] ${
                    msg.sender === 'User' ? 'items-end' : 'items-start'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <div className={`rounded-xl p-2 ${
                        msg.sender === 'User' 
                          ? 'bg-gradient-to-r from-[#0071B2] to-[#0091E2] text-white shadow-lg shadow-blue-500/25' 
                          : 'bg-gradient-to-r from-blue-100 to-white dark:from-blue-900 dark:to-gray-800 shadow-lg shadow-blue-500/10'
                      }`}>
                        {getSenderIcon(msg.sender)}
                      </div>
                      <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r 
                        from-blue-900 to-blue-700 dark:from-blue-200 dark:to-blue-400">
                        {msg.name}
                      </span>
                    </div>
                    <div className={`rounded-2xl px-5 py-3 ${
                      msg.sender === 'User'
                        ? 'bg-gradient-to-r from-[#0071B2] to-[#0091E2] text-white shadow-lg shadow-blue-500/25'
                        : 'bg-gradient-to-r from-blue-100/80 to-white dark:from-blue-900/50 dark:to-gray-800/50 text-gray-900 dark:text-gray-100 shadow-lg shadow-blue-500/10 backdrop-blur-sm'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="relative mt-6">
            <form onSubmit={handleSendMessage} 
              className="flex gap-3 p-1 bg-gradient-to-r from-blue-100/50 to-white dark:from-blue-900/30 dark:to-gray-800/30 
                rounded-2xl shadow-lg backdrop-blur-sm border border-blue-100/50 dark:border-blue-800/50">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-grow rounded-xl border-0 bg-transparent px-4 py-3 focus:ring-0 
                  placeholder:text-blue-400 dark:placeholder:text-blue-300/50"
              />
              <Button 
                type="submit"
                size="icon"
                className="rounded-xl bg-gradient-to-r from-[#0071B2] to-[#0091E2] hover:from-[#0091E2] hover:to-[#0071B2] 
                  text-white shadow-lg shadow-blue-500/25 transition-all duration-300"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
            <div className="absolute inset-x-0 -bottom-2 h-6 bg-gradient-to-t from-blue-50 to-transparent 
              dark:from-gray-900 pointer-events-none"></div>
          </div>
        </TabsContent>

        <TabsContent value="debug" className="flex-grow overflow-auto p-6 bg-gradient-to-br from-blue-50 via-white to-blue-50/50 
          dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/10">
          <div className="grid grid-cols-1 gap-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="hover:bg-blue-50/80 dark:hover:bg-blue-900/20 px-6 py-4 rounded-xl 
                  bg-white/60 dark:bg-blue-900/20 backdrop-blur-sm transition-all duration-200 border border-blue-100/50 dark:border-blue-800/50">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-3 text-red-500" />
                    Error Logs
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 mt-2 rounded-xl bg-white/60 dark:bg-blue-900/20 backdrop-blur-sm 
                  border border-blue-100/50 dark:border-blue-800/50">
                  No errors to display.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-2">
                <AccordionTrigger className="hover:bg-blue-50/80 dark:hover:bg-blue-900/20 px-6 py-4 rounded-xl 
                  bg-white/60 dark:bg-blue-900/20 backdrop-blur-sm transition-all duration-200 border border-blue-100/50 dark:border-blue-800/50">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 mr-3 text-green-500" />
                    Performance Metrics
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 mt-2 rounded-xl bg-white/60 dark:bg-blue-900/20 backdrop-blur-sm 
                  border border-blue-100/50 dark:border-blue-800/50">
                  <p>CPU Usage: <span className="font-semibold text-green-500">5%</span></p>
                  <p>Memory Usage: <span className="font-semibold text-green-500">256MB</span></p>
                  <p>Network Latency: <span className="font-semibold text-green-500">50ms</span></p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-3">
                <AccordionTrigger className="hover:bg-blue-50/80 dark:hover:bg-blue-900/20 px-6 py-4 rounded-xl 
                  bg-white/60 dark:bg-blue-900/20 backdrop-blur-sm transition-all duration-200 border border-blue-100/50 dark:border-blue-800/50">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-3 text-blue-500" />
                    API Requests
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 mt-2 rounded-xl bg-white/60 dark:bg-blue-900/20 backdrop-blur-sm 
                  border border-blue-100/50 dark:border-blue-800/50">
                  <p className="text-success">GET /api/users - 200 OK</p>
                  <p className="text-success">POST /api/messages - 201 Created</p>
                  <p className="text-destructive">GET /api/products - 404 Not Found</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>
    )
  }
)

DrawerContent.displayName = 'DrawerContent';