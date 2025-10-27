import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Loader2, Share2, Check } from "lucide-react";
import { BotData, Message } from "@/lib/types";

interface Step4TestBotProps {
  botData: BotData;
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  error: string | null;
  isCopied: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sendMessage: () => Promise<void>;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  shareConversation: () => Promise<void>;
  saveBotData: () => Promise<void>;
}

export function Step4TestBot({
  botData,
  messages,
  inputMessage,
  isLoading,
  error,
  isCopied,
  messagesEndRef,
  setInputMessage,
  setMessages,
  sendMessage,
  handleKeyPress,
  shareConversation,
  saveBotData,
}: Step4TestBotProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Test Your Bot</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Try out your bot and see how it responds to different questions. You
          can share your bot or launch it when you&apos;re satisfied.
        </p>

        <div className="max-w-2xl mx-auto">
          <div>
            <label className="block text-sm font-medium mb-3">
              Chat with Your Bot
            </label>
            <Card className="p-4 h-[400px] flex flex-col">
              {error && (
                <div className="mb-4 p-3 rounded border text-sm">{error}</div>
              )}

              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">
                      Start a conversation with your bot!
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-2 text-xs ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === "assistant" && (
                            <Bot className="w-3 h-3 mt-0.5 shrink-0" />
                          )}
                          {message.role === "user" && (
                            <User className="w-3 h-3 mt-0.5 shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-xs">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-lg p-2 flex items-center space-x-2">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span className="text-xs">Bot is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="text-xs"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="sm"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={shareConversation}
                disabled={messages.length === 0 || !botData.name}
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Your Bot
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setMessages([])}
                disabled={messages.length === 0}
              >
                Clear Conversation
              </Button>
            </div>
            <Button
              onClick={saveBotData}
              disabled={!botData.name || !botData.personality}
            >
              Launch Bot
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
