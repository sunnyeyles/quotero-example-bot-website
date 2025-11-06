"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bot, User, Loader2, Send, Trash2 } from "lucide-react";
import { SuggestedQuestion } from "@/lib/types";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";

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
  onSendMessage: (message?: string) => void | Promise<void>;
  onKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  error?: string | null;
  onClearMessages?: () => void;
  suggestedQuestions?: SuggestedQuestion[];
  setMessages?: React.Dispatch<React.SetStateAction<Message[]>>;
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
  suggestedQuestions = [],
  setMessages,
}: Step4TestBotProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    onSendMessage();
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading || !setMessages) return;

    // Find the suggested question that matches
    const suggestedQ = suggestedQuestions.find(
      (sq) => sq.question.trim() === suggestion.trim()
    );

    if (suggestedQ && suggestedQ.answer.trim()) {
      // Add user message with the question
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: suggestedQ.question,
        timestamp: new Date(),
      };

      // Add bot message with the pre-written answer
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: suggestedQ.answer,
        timestamp: new Date(),
      };

      // Add both messages at once
      setMessages((prev: Message[]) => [...prev, userMessage, botMessage]);
    } else {
      // Fallback: if no answer found, just send the question normally
      onSendMessage(suggestion);
    }
  };

  // Typing animation for opening message
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasTypedOpeningRef = useRef(false);

  // Check if this is the opening message (first assistant message, no user messages)
  const openingMessage = messages.find(
    (msg) =>
      msg.role === "assistant" &&
      messages.filter((m) => m.role === "user").length === 0
  );

  useEffect(() => {
    // Only animate typing for the opening message
    if (openingMessage && !hasTypedOpeningRef.current) {
      setIsTyping(true);
      setTypingText("");
      hasTypedOpeningRef.current = true;

      let currentIndex = 0;
      const fullText = openingMessage.content;
      const typingSpeed = 30; // milliseconds per character

      const typeNextChar = () => {
        if (currentIndex < fullText.length) {
          setTypingText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
          typingTimeoutRef.current = setTimeout(typeNextChar, typingSpeed);
        } else {
          setIsTyping(false);
        }
      };

      // Start typing after a small delay
      typingTimeoutRef.current = setTimeout(typeNextChar, 300);

      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    } else if (!openingMessage) {
      // Reset when opening message is removed
      hasTypedOpeningRef.current = false;
      setTypingText("");
      setIsTyping(false);
    }
  }, [openingMessage?.id, openingMessage?.content]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Filter out empty suggestions
  const validSuggestions = suggestedQuestions
    .filter((sq) => sq.question.trim().length > 0)
    .map((sq) => sq.question);

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
                <p className="text-sm mb-4">
                  Start a conversation with your bot!
                </p>
                {validSuggestions.length > 0 && (
                  <div className="mt-4">
                    <Suggestions>
                      {validSuggestions.map((suggestion, index) => (
                        <Suggestion
                          key={index}
                          suggestion={suggestion}
                          onClick={handleSuggestionClick}
                        />
                      ))}
                    </Suggestions>
                  </div>
                )}
              </div>
            ) : (
              messages.map((message) => {
                // For opening message, use typing animation
                const isOpeningMessage =
                  message.role === "assistant" &&
                  message.id === openingMessage?.id;
                const displayText =
                  isOpeningMessage && typingText.length > 0
                    ? typingText
                    : isOpeningMessage && typingText.length === 0
                    ? "" // Don't show anything until typing starts
                    : message.content;

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${
                        message.role === "user"
                          ? "flex-row-reverse"
                          : "flex-row"
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
                        <p className="whitespace-pre-wrap">
                          {displayText}
                          {isOpeningMessage && isTyping && (
                            <span className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse" />
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
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

          {/* Suggested Questions - Show when there are messages but input is empty */}
          {messages.length > 0 &&
            validSuggestions.length > 0 &&
            !inputMessage.trim() &&
            !isLoading && (
              <div className="mt-4">
                <Suggestions>
                  {validSuggestions.map((suggestion, index) => (
                    <Suggestion
                      key={index}
                      suggestion={suggestion}
                      onClick={handleSuggestionClick}
                    />
                  ))}
                </Suggestions>
              </div>
            )}

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
