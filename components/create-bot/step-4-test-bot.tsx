"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, User, Loader2, Send, Trash2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Step4TestBotProps {
  messages: Message[];
  inputMessage: string;
  setInputMessage: (value: string) => void;
  isLoading: boolean;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  error?: string | null;
  onClearMessages?: () => void;
}

export function Step4TestBot({
  messages,
  inputMessage,
  setInputMessage,
  isLoading,
  onSendMessage,
  onKeyPress,
  messagesEndRef,
  error,
  onClearMessages,
}: Step4TestBotProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    onSendMessage();
  };

  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto">
        <div>
          <label className="block text-sm font-medium mb-3">
            Chat with Your Bot
          </label>

          {error && (
            <Badge variant="destructive" className="w-fit mb-4">
              Error: {error}
            </Badge>
          )}

          {/* Messages */}
          <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm">Start a conversation with your bot!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
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
                        <User className="h-6 w-6 text-muted-foreground" />
                      ) : (
                        <Bot className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg px-3 py-2 text-xs ${
                        message.role === "user"
                          ? "bg-muted text-foreground"
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
                <Bot className="h-6 w-6 text-muted-foreground shrink-0" />
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs text-muted-foreground">
                      Bot is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <Separator />

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) =>
                onKeyPress(
                  e as unknown as React.KeyboardEvent<HTMLTextAreaElement>
                )
              }
              placeholder="Type your message here..."
              disabled={isLoading}
              className="flex-1 text-xs"
            />
            <Button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              size="sm"
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>

          {/* Clear Button */}
          {messages.length > 0 && onClearMessages && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={onClearMessages}
                className="flex items-center gap-2"
                size="sm"
                type="button"
              >
                <Trash2 className="h-4 w-4" />
                Clear Chat
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
