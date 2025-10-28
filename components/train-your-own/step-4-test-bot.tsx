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
    <div>
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-3 tracking-tight">
            Test Your Bot
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Try out your bot and see how it responds to different questions. You
            can share your bot or launch it when you&apos;re satisfied.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            <label className="block text-lg font-semibold mb-4">
              Chat with Your Bot
            </label>
            <Card className="p-6 h-[500px] flex flex-col shadow-lg">
              {error && (
                <div className="mb-4 p-4 rounded-lg border text-sm bg-destructive/10">
                  {error}
                </div>
              )}

              <div className="flex-1 overflow-y-auto mb-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">
                      Start a conversation with your bot!
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Ask questions about your business or services
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
                        className={`max-w-[80%] rounded-xl p-4 text-sm shadow-sm ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {message.role === "assistant" && (
                            <Bot className="w-5 h-5 mt-0.5 shrink-0" />
                          )}
                          {message.role === "user" && (
                            <User className="w-5 h-5 mt-0.5 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm wrap-break-word">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-xl p-4 flex items-center space-x-3 bg-muted shadow-sm">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm font-medium">
                        Bot is thinking...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex space-x-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="text-lg py-3 flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  size="lg"
                  className="px-6"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                variant="outline"
                onClick={shareConversation}
                disabled={messages.length === 0 || !botData.name}
                className="w-full sm:w-auto"
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
                className="w-full sm:w-auto"
              >
                Clear Conversation
              </Button>
            </div>
            <Button
              onClick={saveBotData}
              disabled={!botData.name || !botData.personality}
              className="w-full sm:w-auto"
            >
              Launch Bot
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
