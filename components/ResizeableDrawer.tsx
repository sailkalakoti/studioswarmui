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

export default function ResizableDrawer({ port }: { port: number }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [width, setWidth] = useState(420);
  const [isDragging, setIsDragging] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const drawerRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)

  const toggleDrawer = () => setIsOpen(!isOpen)
  const toggleExpand = () => setIsExpanded(!isExpanded)

  const postChatMutation = useApiMutation('http://178.156.143.254:'+port+'/chat', 'POST', {
    onSuccess: (data: any) => {
      setChatMessages(prevMessage => ([
        ...prevMessage,
        {
          sender: 'System',
          message: data?.response,
        }
      ]))
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
      setChatMessages([...chatMessages, { sender: 'User', message: inputMessage }])
      postChatMutation.mutate({
        "user_input": inputMessage,
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
        return <Bot className="h-4 w-4" />
      case 'User':
        return <User className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <>
      <div className="fixed inset-y-0 right-0 flex top-[70px]">
        <button
          onClick={toggleDrawer}
          className="self-center -ml-3 p-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label={isOpen ? "Close drawer" : "Open drawer"}
        >
          <ChevronLeft className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && !isExpanded && (
          <div
            ref={drawerRef}
            className="h-full bg-background/90 backdrop-blur-sm border-l border-border shadow-lg flex flex-col relative"
            style={{ width: `${width}px` }}
          >
            <div
              ref={resizeHandleRef}
              className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize bg-border hover:bg-primary/50 transition-colors"
              onMouseDown={startResizing}
            />
            <div className="flex justify-end p-2">
              <Button
                onClick={toggleExpand}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Expand drawer"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
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
        )}
      </div>
      {isExpanded && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="w-[80%] h-[80%] bg-background/90 backdrop-blur-sm shadow-lg rounded-lg flex flex-col">
            <div className="flex justify-end p-2">
              <Button
                onClick={toggleExpand}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Minimize drawer"
              >
                <Minimize2 className="h-6 w-6" />
              </Button>
              <Button
                onClick={() => {
                  setIsExpanded(false);
                  setIsOpen(false);
                }}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground ml-2"
                aria-label="Close drawer"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex-grow overflow-hidden">
              <DrawerContent
                inputMessage={inputMessage}
                ref={messagesContainerRef}
                setInputMessage={setInputMessage}
                getSenderIcon={getSenderIcon}
                chatMessages={chatMessages}
                handleSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )


}

interface ChatMessageType {
  sender: string;
  message: string;
}

interface DrawerContentProps {
  chatMessages: ChatMessageType[];
  getSenderIcon: (sender: string) => React.JSX.Element;
  handleSendMessage: (e: React.FormEvent) => void;
  inputMessage: string,
  setInputMessage: Dispatch<SetStateAction<string>>,
}


const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(({ chatMessages, getSenderIcon, handleSendMessage, inputMessage, setInputMessage }, ref) => {
  return (
    <Tabs defaultValue="chat" className="flex-grow flex flex-col overflow-y-hidden">
      <TabsList className="grid w-full grid-cols-2 p-1 gap-1">
        <TabsTrigger value="chat" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Chat</TabsTrigger>
        <TabsTrigger value="debug" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Debug</TabsTrigger>
      </TabsList>
      <TabsContent value="chat" className="flex-grow flex flex-col p-4 overflow-y-auto">
        <ScrollArea className="flex-grow mb-4 pr-4 " ref={ref}>
          {chatMessages.map((msg, index) => (
            <div key={index} className={`mb-2 flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-2 max-w-[80%] ${msg.sender === 'User' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`rounded-full p-2 ${msg.sender === 'User' ? 'bg-primary/90 text-primary-foreground' :
                    msg.sender === 'System' ? 'bg-secondary/90 text-secondary-foreground' :
                      'bg-muted/90 text-muted-foreground'
                  }`}>
                  {getSenderIcon(msg.sender)}
                </div>
                <div className={`rounded-lg px-3 py-2 ${msg.sender === 'User' ? 'bg-primary/90 text-primary-foreground' :
                    msg.sender === 'System' ? 'bg-secondary/90 text-secondary-foreground' :
                      'bg-muted/90 text-muted-foreground'
                  }`}>
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            id="chat"
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </TabsContent>
      <TabsContent value="debug" className="flex-grow overflow-auto p-4">
        <div className="grid grid-cols-1 gap-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="hover:bg-muted/60 px-4 py-3 rounded-md bg-muted/40">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
                  Error Logs
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2 mt-2">
                No errors to display.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-2">
              <AccordionTrigger className="hover:bg-muted/60 px-4 py-3 rounded-md bg-muted/40">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-primary" />
                  Performance Metrics
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2 mt-2">
                <p>CPU Usage: <span className="font-semibold text-primary">5%</span></p>
                <p>Memory Usage: <span className="font-semibold text-primary">256MB</span></p>
                <p>Network Latency: <span className="font-semibold text-primary">50ms</span></p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-3">
              <AccordionTrigger className="hover:bg-muted/60 px-4 py-3 rounded-md bg-muted/40">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-secondary" />
                  API Requests
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2 mt-2">
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
})