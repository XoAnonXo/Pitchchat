import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Send, ExternalLink } from "lucide-react";
import { StartupLoadingSkeleton } from "./StartupLoadingSkeleton";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  tokenCount?: number;
  citations?: Array<{
    source: string;
    content: string;
    page?: number;
  }>;
  timestamp: number;
}

interface ChatInterfaceProps {
  projectId: string;
  model?: string;
}

export default function ChatInterface({ projectId, model = 'gpt-4o' }: ChatInterfaceProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your AI assistant. I've analyzed your uploaded documents and I'm ready to answer questions about your startup pitch. What would you like to know?",
      timestamp: Date.now(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", `/api/projects/${projectId}/chat`, { message, model });
      return res.json();
    },
    onSuccess: (response) => {
      const assistantMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: "assistant",
        content: response.content,
        tokenCount: response.tokenCount,
        citations: response.citations,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      content: inputMessage.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(inputMessage.trim());
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex-1 flex flex-col min-h-0">
      {/* Messages Area - Monochrome like landing */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[400px]">
        {messages.map((message) => (
          <div key={message.id} className={`flex space-x-3 ${message.role === "user" ? "justify-end" : ""}`}>
            {message.role === "assistant" && (
              <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-sm">AI</span>
              </div>
            )}

            <div className={`flex-1 ${message.role === "user" ? "max-w-md" : ""}`}>
              <div className={`p-4 rounded-xl ${
                message.role === "user"
                  ? "bg-black text-white"
                  : "bg-black/[0.04]"
              }`}>
                <p className={message.role === "user" ? "text-white" : "text-black"}>
                  {message.content}
                </p>
              </div>

              {/* Citations */}
              {message.citations && message.citations.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.citations.map((citation, idx) => (
                    <div key={idx} className="border-l-4 border-black/20 pl-3 bg-white p-2 rounded-r-md">
                      <p className="text-sm text-black/60 italic">"{citation.content}"</p>
                      <p className="text-xs text-black/45 mt-1 flex items-center space-x-1">
                        <ExternalLink className="w-3 h-3" />
                        <span>Source: {citation.source}</span>
                        {citation.page && <span>, page {citation.page}</span>}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-2 mt-2">
                <p className="text-xs text-black/45">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>

            {message.role === "user" && (
              <div className="w-8 h-8 bg-black/[0.04] rounded-xl flex-shrink-0" />
            )}
          </div>
        ))}

        {chatMutation.isPending && (
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium text-sm">AI</span>
            </div>
            <div className="flex-1">
              <div className="bg-black/[0.04] rounded-xl p-4">
                <StartupLoadingSkeleton type="chat" className="scale-50 origin-left" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Monochrome like landing */}
      <div className="p-6 border-t border-black/[0.08]">
        <div className="flex space-x-3">
          <Input
            placeholder="Ask a question about your documents..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-black/[0.03] border-black/10 focus:border-black rounded-xl"
            disabled={chatMutation.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || chatMutation.isPending}
            className="bg-black hover:bg-black/90 text-white rounded-xl"
          >
            {chatMutation.isPending ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-black/45 mt-2">
          Test your AI responses before sharing with investors
        </p>
      </div>
    </div>
  );
}
