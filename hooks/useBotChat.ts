"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Message,
  BotData,
  ChatRequest,
  ChatResponse,
} from "@/lib/types";
import LZString from "lz-string";

export interface UseBotChatOptions {
  botData: BotData;
}

export interface UseBotChatReturn {
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  error: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setInputMessage: (message: string) => void;
  setError: (error: string | null) => void;
  sendMessage: (message?: string) => Promise<void>;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function useBotChat({ botData }: UseBotChatOptions): UseBotChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Utility functions
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  // Load shared conversation messages from URL on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1);
      if (hash) {
        try {
          const decompressed = LZString.decompressFromEncodedURIComponent(hash);
          if (decompressed) {
            const sharedData = JSON.parse(decompressed);
            if (sharedData.messages && Array.isArray(sharedData.messages)) {
              // Convert timestamp strings back to Date objects
              const messagesWithDates = sharedData.messages.map(
                (msg: Message) => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp),
                })
              );
              setMessages(messagesWithDates);
            }
          }
        } catch (error) {
          console.error("Failed to load shared conversation:", error);
        }
      }
    }
  }, []);

  const sendMessage = useCallback(async (messageOverride?: string) => {
    const messageToSend = messageOverride || inputMessage;
    
    if (!messageToSend.trim()) {
      setError("Please provide a message");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageToSend,
      timestamp: new Date(),
    };

    const currentInputMessage = messageToSend;
    const currentMessages = messages;
    
    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError(null);

    try {
      const request: ChatRequest = {
        message: currentInputMessage,
        botData,
        conversationHistory: currentMessages,
      };

      const response = await fetch("/api/bots/train-your-own", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data: ChatResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev: Message[]) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, botData, messages]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return {
    messages,
    inputMessage,
    isLoading,
    error,
    messagesEndRef,
    setMessages,
    setInputMessage,
    setError,
    sendMessage,
    handleKeyPress,
  };
}

