"use client";

import { useState } from "react";
import { useAIChat } from "@/hooks/useAIChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Send, Bot, User, Trash2 } from "lucide-react";

export function AIChatDemo() {
  const [inputValue, setInputValue] = useState("");
  const { messages, isLoading, error, sendMessage, clearMessages } = useAIChat({
    model: "gpt-4o-mini",
    temperature: 0.7,
    onError: (error) => console.error("AI Chat Error:", error),
    onFinish: (content) => console.log("AI Response completed:", content),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    await sendMessage(inputValue);
    setInputValue("");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Chat Demo
        </CardTitle>
        <CardDescription>
          Chat with OpenAI using the Vercel AI SDK. This demonstrates streaming
          responses.
        </CardDescription>
        {error && (
          <Badge variant="destructive" className="w-fit">
            Error: {error}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Messages */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Start a conversation by typing a message below
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className="shrink-0">
                    {message.role === "user" ? (
                      <User className="h-6 w-6 text-primary" />
                    ) : (
                      <Bot className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Bot className="h-6 w-6 text-primary shrink-0" />
              <div className="bg-muted rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-muted-foreground">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message here..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>

        {/* Clear Button */}
        {messages.length > 0 && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={clearMessages}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Chat
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
