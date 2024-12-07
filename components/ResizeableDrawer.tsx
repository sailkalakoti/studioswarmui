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
import { ChevronLeft, Send, AlertCircle, Activity, Globe, User, Bot, Server, Maximize2, Minimize2, X, Settings, MessageSquare, Plus, MessageCircle, AlertTriangle } from 'lucide-react'
import { useApiMutation } from '@/lib/utils'

const BRAND_BLUE = '#0071B2';

interface ChatMessageType {
  sender: string;
  message: string;
  name: string;
}

interface DrawerContentProps {
  chatMessages: ChatMessageType[];
  getSenderIcon: (sender: string) => React.JSX.Element;
  handleSendMessage: (e: React.FormEvent) => void;
  inputMessage: string;
  setInputMessage: Dispatch<SetStateAction<string>>;
  disabled?: boolean;
}

interface ResizableDrawerProps {
  port: number;
  instanceId: string;
  onClose: Function;
  mode: 'normal' | 'context';
}

const ResizableDrawer = ({ port, instanceId, onClose, mode }: ResizableDrawerProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [width, setWidth] = useState(420);
  const [isDragging, setIsDragging] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [contextVars, setContextVars] = useState<Array<{ key: string; value: string }>>([]);
  const [isChatEnabled, setIsChatEnabled] = useState(mode === 'normal');
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

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

  const addContextVar = () => {
    setContextVars([...contextVars, { key: '', value: '' }]);
  };

  const removeContextVar = (index: number) => {
    setContextVars(contextVars.filter((_, i) => i !== index));
  };

  const handleContextVarSubmit = () => {
    const contextObject = contextVars.reduce((acc, { key, value }) => {
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    setIsChatEnabled(true);
  };

  // Common button style for both modes
  const startChatButtonStyle = "px-8 bg-[#002856] hover:bg-[#002856]/90 text-white shadow-lg shadow-[#002856]/25 transition-all duration-300 gap-2"

  return (
    <div className="fixed inset-y-0 right-0 flex top-[70px] z-50">
      {(isOpen || isExpanded) && (
        <div 
          className="fixed inset-0 bg-transparent" 
        />
      )}

      {isOpen && !isExpanded ? (
        <div
          ref={drawerRef}
          className="h-[calc(100vh-90px)] mx-6 my-4 border shadow-2xl flex flex-col relative
            backdrop-blur-xl 
            bg-white/95 dark:bg-[#002856]/95
            border-[#002856]/10 dark:border-[#002856]/20
            rounded-2xl
            shadow-[0_8px_40px_-12px_rgba(0,40,86,0.1),0_0_20px_-12px_rgba(0,40,86,0.15)]
            dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3),0_0_20px_-12px_rgba(0,40,86,0.2)]
            transition-all duration-500 ease-in-out
            hover:shadow-[0_20px_60px_-12px_rgba(0,40,86,0.15),0_0_30px_-12px_rgba(0,40,86,0.2)]
            dark:hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.4),0_0_30px_-12px_rgba(0,40,86,0.25)]
            hover:translate-y-[-2px]
            transform"
          style={{ width: `${width}px` }}
        >
          <div
            ref={resizeHandleRef}
            className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize 
              hover:bg-blue-500/50 transition-colors
              before:absolute before:left-[-2px] before:top-0 before:bottom-0 before:w-[3px]
              before:bg-white/20 dark:before:bg-white/10"
            onMouseDown={startResizing}
          />
          
          {/* Header */}
          <div className="flex items-center justify-between p-3 
            border-b border-[#002856]/10
            bg-[#002856]/5 dark:bg-[#002856]/20
            backdrop-blur-xl
            rounded-tl-2xl rounded-tr-2xl"
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-[3px]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#002856] animate-pulse" />
                <div className="w-1 h-1 rounded-full bg-[#002856]/50 animate-pulse delay-75" />
                <div className="w-[3px] h-[3px] rounded-full bg-[#002856]/30 animate-pulse delay-150" />
              </div>
              <h2 className="font-medium text-[15px] text-[#002856] dark:text-white/90">
                Chat
              </h2>
            </div>
            <div className="flex gap-1">
              <Button
                onClick={toggleExpand}
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-[#002856]/5 dark:hover:bg-white/5 text-[#002856] dark:text-white/80"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                onClick={() => {
                  setIsExpanded(false);
                  setIsOpen(false);
                  onClose();
                }}
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex-grow flex flex-col overflow-hidden 
            bg-white/50 dark:bg-[#002856]/10
            rounded-bl-2xl"
          >
            {mode === 'context' && !isChatEnabled ? (
              <div className="p-6 border-b">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold text-gray-900">Context Variables</h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addContextVar}
                      className="text-sm hover:bg-blue-50"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Variable
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {contextVars.length === 0 ? (
                      <div className="text-center py-8 bg-[#002856]/5 rounded-lg 
                        border border-[#002856]/10 text-[#002856] dark:text-white/80">
                        Click &quot;Add Variable&quot; to get started
                      </div>
                    ) : (
                      contextVars.map((contextVar, index) => (
                        <div 
                          key={index} 
                          className="flex gap-2 p-2 bg-white/80 dark:bg-blue-950/50 rounded-lg 
                            border border-blue-100 dark:border-blue-800 
                            shadow-sm hover:shadow-md transition-all duration-300
                            hover:border-blue-200 dark:hover:border-blue-700"
                        >
                          <Input
                            placeholder="Variable name"
                            value={contextVar.key}
                            onChange={(e) => {
                              const newVars = [...contextVars];
                              newVars[index].key = e.target.value;
                              setContextVars(newVars);
                            }}
                            className="border-blue-100 focus:border-blue-300 focus:ring-blue-200 
                              dark:border-blue-800 dark:focus:border-blue-600 dark:focus:ring-blue-700
                              bg-white/80 dark:bg-blue-900/50"
                          />
                          <Input
                            placeholder="Value"
                            value={contextVar.value}
                            onChange={(e) => {
                              const newVars = [...contextVars];
                              newVars[index].value = e.target.value;
                              setContextVars(newVars);
                            }}
                            className="border-blue-100 focus:border-blue-300 focus:ring-blue-200 
                              dark:border-blue-800 dark:focus:border-blue-600 dark:focus:ring-blue-700
                              bg-white/80 dark:bg-blue-900/50"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeContextVar(index)}
                            className="hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>

                  {contextVars.length > 0 && (
                    <div className="flex justify-center pt-2">
                      <Button
                        variant="primary"
                        className={startChatButtonStyle}
                        onClick={handleContextVarSubmit}
                      >
                        <MessageCircle className="h-4 w-4" />
                        Start Chat
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
            <div className="flex-grow flex flex-col p-6 overflow-hidden">
              <ScrollArea className="flex-grow pr-4" ref={messagesContainerRef}>
                {chatMessages.length === 0 ? (
                  <EmptyStateMessage mode={mode} isChatEnabled={isChatEnabled} />
                ) : (
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
                            <div className={`rounded-full p-2 ${
                              msg.sender === 'User' 
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-2 ring-blue-400 ring-offset-2' 
                                : 'bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-700 ring-2 ring-gray-200 dark:ring-gray-700 ring-offset-2'
                            }`}>
                              {getSenderIcon(msg.sender)}
                            </div>
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {msg.name}
                            </span>
                          </div>
                          <div className={`rounded-2xl px-5 py-3 transform transition-all duration-300 hover:scale-[1.02] ${
                            msg.sender === 'User'
                              ? 'bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 border border-white/20'
                              : 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 text-gray-900 dark:text-gray-100 shadow-lg border border-white/10'
                          }`}>
                            <p className="text-sm leading-relaxed backdrop-blur-sm">{msg.message}</p>
                          </div>
                          <span className="text-xs text-gray-400 px-2">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              <div className="relative mt-6">
                <form onSubmit={handleSendMessage} 
                  className="flex gap-3 p-2 
                    bg-gradient-to-r from-gray-200/80 via-gray-100/80 to-gray-200/80 
                    dark:from-gray-700/80 dark:via-gray-800/80 dark:to-gray-700/80
                    rounded-2xl shadow-lg backdrop-blur-xl 
                    border border-white/20 dark:border-white/10
                    transform transition-all duration-300 
                    focus-within:scale-[1.02] focus-within:shadow-2xl
                    focus-within:border-blue-500/20"
                >
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={mode === 'context' && !isChatEnabled}
                    className="flex-grow rounded-xl border-0 px-4 py-3 
                      bg-transparent backdrop-blur-sm
                      focus:ring-0 focus:outline-none
                      placeholder:text-gray-400 text-gray-900 dark:text-white"
                  />
                  <Button 
                    type="submit"
                    size="icon"
                    disabled={mode === 'context' && !isChatEnabled}
                    className={`rounded-xl transition-all duration-200 ${
                      mode === 'context' && !isChatEnabled
                        ? 'bg-amber-100 text-amber-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 hover:rotate-12 shadow-lg shadow-blue-500/25'
                    }`}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                
                <div className="absolute inset-x-0 -bottom-4 h-8 bg-gradient-to-t from-white to-transparent 
                  dark:from-gray-900 pointer-events-none opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      ) : isExpanded ? (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="fixed inset-x-[12.5%] inset-y-[12.5%] 
            bg-white/95 dark:bg-[#002856]/95
            rounded-2xl shadow-2xl 
            border border-[#002856]/10 dark:border-[#002856]/20
            backdrop-blur-2xl
            flex flex-col"
          >
            <div className="flex items-center justify-between p-3 
              border-b border-[#002856]/10
              bg-[#002856]/5 dark:bg-[#002856]/20
              backdrop-blur-xl
              rounded-t-2xl"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-[3px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#002856] animate-pulse" />
                  <div className="w-1 h-1 rounded-full bg-[#002856]/50 animate-pulse delay-75" />
                  <div className="w-[3px] h-[3px] rounded-full bg-[#002856]/30 animate-pulse delay-150" />
                </div>
                <h2 className="font-medium text-[15px] text-[#002856] dark:text-white/90">
                  Chat
                </h2>
              </div>
              <div className="flex gap-1">
                <Button
                  onClick={toggleExpand}
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-[#002856]/5 dark:hover:bg-white/5 text-[#002856] dark:text-white/80"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  onClick={() => {
                    setIsExpanded(false);
                    setIsOpen(false);
                    onClose();
                  }}
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex-grow flex flex-col overflow-hidden 
              bg-white/50 dark:bg-[#002856]/10
              rounded-b-2xl"
            >
              {mode === 'context' && !isChatEnabled ? (
                <div className="p-6 border-b">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-blue-500" />
                        <h3 className="font-semibold text-gray-900">Context Variables</h3>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addContextVar}
                        className="text-sm hover:bg-blue-50"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Variable
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {contextVars.length === 0 ? (
                        <div className="text-center py-8 bg-blue-50/70 rounded-lg 
                          border border-blue-200/50 text-blue-600/80">
                          Click &quot;Add Variable&quot; to get started
                        </div>
                      ) : (
                        contextVars.map((contextVar, index) => (
                          <div 
                            key={index} 
                            className="flex gap-2 p-2 bg-white/80 dark:bg-blue-950/50 rounded-lg 
                              border border-blue-100 dark:border-blue-800 
                              shadow-sm hover:shadow-md transition-all duration-300
                              hover:border-blue-200 dark:hover:border-blue-700"
                          >
                            <Input
                              placeholder="Variable name"
                              value={contextVar.key}
                              onChange={(e) => {
                                const newVars = [...contextVars];
                                newVars[index].key = e.target.value;
                                setContextVars(newVars);
                              }}
                              className="border-blue-100 focus:border-blue-300 focus:ring-blue-200 
                                dark:border-blue-800 dark:focus:border-blue-600 dark:focus:ring-blue-700
                                bg-white/80 dark:bg-blue-900/50"
                            />
                            <Input
                              placeholder="Value"
                              value={contextVar.value}
                              onChange={(e) => {
                                const newVars = [...contextVars];
                                newVars[index].value = e.target.value;
                                setContextVars(newVars);
                              }}
                              className="border-blue-100 focus:border-blue-300 focus:ring-blue-200 
                                dark:border-blue-800 dark:focus:border-blue-600 dark:focus:ring-blue-700
                                bg-white/80 dark:bg-blue-900/50"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeContextVar(index)}
                              className="hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>

                    {contextVars.length > 0 && (
                      <div className="flex justify-center pt-2">
                        <Button
                          variant="primary"
                          onClick={handleContextVarSubmit}
                          className={startChatButtonStyle}
                        >
                          <MessageCircle className="h-4 w-4" />
                          Start Chat
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
              <div className="flex-grow flex flex-col p-6 overflow-hidden">
                <ScrollArea className="flex-grow pr-4" ref={messagesContainerRef}>
                  {chatMessages.length === 0 ? (
                    <EmptyStateMessage mode={mode} isChatEnabled={isChatEnabled} />
                  ) : (
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
                              <div className={`rounded-full p-2 ${
                                msg.sender === 'User' 
                                  ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-2 ring-blue-400 ring-offset-2' 
                                  : 'bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-700 ring-2 ring-gray-200 dark:ring-gray-700 ring-offset-2'
                              }`}>
                                {getSenderIcon(msg.sender)}
                              </div>
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                {msg.name}
                              </span>
                            </div>
                            <div className={`rounded-2xl px-5 py-3 transform transition-all duration-300 hover:scale-[1.02] ${
                              msg.sender === 'User'
                                ? 'bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 border border-white/20'
                                : 'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 text-gray-900 dark:text-gray-100 shadow-lg border border-white/10'
                            }`}>
                              <p className="text-sm leading-relaxed backdrop-blur-sm">{msg.message}</p>
                            </div>
                            <span className="text-xs text-gray-400 px-2">
                              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                <div className="relative mt-6">
                  <form onSubmit={handleSendMessage} 
                    className="flex gap-3 p-2
                      bg-gradient-to-r from-gray-200/80 via-gray-100/80 to-gray-200/80 
                      dark:from-gray-700/80 dark:via-gray-800/80 dark:to-gray-700/80
                      rounded-2xl shadow-lg backdrop-blur-xl 
                      border border-white/20 dark:border-white/10
                      transform transition-all duration-300
                      focus-within:scale-[1.02] focus-within:shadow-2xl
                      focus-within:border-blue-500/20">
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      disabled={mode === 'context' && !isChatEnabled}
                      className="flex-grow rounded-xl border-0 px-4 py-3 
                        bg-transparent backdrop-blur-sm
                        focus:ring-0 focus:outline-none
                        placeholder:text-gray-400 text-gray-900 dark:text-white"
                    />
                    <Button 
                      type="submit"
                      size="icon"
                      disabled={mode === 'context' && !isChatEnabled}
                      className={`rounded-xl transition-all duration-200 ${
                        mode === 'context' && !isChatEnabled
                          ? 'bg-amber-100 text-amber-400 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 hover:rotate-12 shadow-lg shadow-blue-500/25'
                      }`}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                  
                  <div className="absolute inset-x-0 -bottom-4 h-8 bg-gradient-to-t from-white to-transparent 
                    dark:from-gray-900 pointer-events-none opacity-80"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

interface EmptyStateMessageProps {
  mode: string;
  isChatEnabled: boolean;
}

const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({ mode, isChatEnabled }) => {
  if (mode === 'context' && !isChatEnabled) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 text-center p-6">
        <div className="w-20 h-20 rounded-full 
          bg-gradient-to-br from-amber-500/20 via-amber-400/20 to-amber-500/20 
          backdrop-blur-xl border border-amber-500/30
          flex items-center justify-center 
          shadow-[0_0_30px_rgba(251,191,36,0.2)]
          transform transition-all duration-500 
          hover:scale-110 hover:rotate-12 group"
        >
          <AlertTriangle className="w-10 h-10 text-amber-500 
            transform transition-all duration-500 
            group-hover:scale-110 group-hover:rotate-12" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-500">
            Context Variables Required
          </h3>
          <p className="text-sm text-amber-600/80 max-w-sm leading-relaxed">
            Please set the context variables before starting the chat.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-6">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-white dark:from-blue-900 dark:to-gray-800
        flex items-center justify-center shadow-xl shadow-blue-500/20"
      >
        <MessageSquare className="w-8 h-8 text-blue-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
          Start a Conversation
        </h3>
        <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
          Begin chatting with your AI assistant. Type your message below to get started.
        </p>
      </div>
    </div>
  );
}

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>((props, ref) => {
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
            {props.chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'} 
                  animate-in slide-in-from-${msg.sender === 'User' ? 'right' : 'left'}`}
              >
                <div className={`flex flex-col space-y-2 max-w-[80%] ${
                  msg.sender === 'User' ? 'items-end' : 'items-start'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className={`rounded-full p-2 ${
                      msg.sender === 'User' 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-2 ring-blue-400 ring-offset-2' 
                        : 'bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-700 ring-2 ring-gray-200 dark:ring-gray-700 ring-offset-2'
                    }`}>
                      {props.getSenderIcon(msg.sender)}
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {msg.name}
                    </span>
                  </div>
                  <div className={`rounded-2xl px-5 py-3 transform transition-all duration-200 hover:scale-[1.02] ${
                    msg.sender === 'User'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-700 text-gray-900 dark:text-gray-100 shadow-lg'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                  </div>
                  <span className="text-xs text-gray-400 px-2">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="relative mt-6">
          <form onSubmit={props.handleSendMessage} 
            className="flex gap-3 p-2 bg-gradient-to-r from-gray-200/80 via-gray-100/80 to-gray-200/80 
              dark:from-gray-700/80 dark:via-gray-800/80 dark:to-gray-700/80
              rounded-2xl shadow-lg backdrop-blur-xl 
              border border-white/20 dark:border-white/10
              transform transition-all duration-300 
              focus-within:scale-[1.02] focus-within:shadow-2xl
              focus-within:border-blue-500/20"
          >
            <Input
              type="text"
              placeholder="Type your message..."
              value={props.inputMessage}
              onChange={(e) => props.setInputMessage(e.target.value)}
              disabled={props.disabled}
              className={`flex-grow rounded-xl border-0 px-4 py-3 focus:ring-0 
                focus:outline-none ${
                  props.disabled
                    ? 'bg-gray-50 cursor-not-allowed opacity-50'
                    : 'placeholder:text-gray-400 text-gray-900 dark:text-white bg-white/80 dark:bg-gray-800/80'
                }`}
            />
            <Button 
              type="submit"
              size="icon"
              disabled={props.disabled}
              className={`rounded-xl transition-all duration-200 ${
                props.disabled
                  ? 'bg-amber-100 text-amber-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105 hover:rotate-12 shadow-lg shadow-blue-500/25'
              }`}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          
          <div className="absolute inset-x-0 -bottom-4 h-8 bg-gradient-to-t from-white to-transparent 
            dark:from-gray-900 pointer-events-none opacity-80"></div>
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
})

DrawerContent.displayName = 'DrawerContent';

export default ResizableDrawer;