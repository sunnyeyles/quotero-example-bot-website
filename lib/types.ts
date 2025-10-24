export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface BotData {
  name: string;
  personality: string;
  trainingData: string;
  files: UploadedFile[];
  websiteUrl: string;
  websiteContent: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  content: string;
  size: number;
}

export interface ChatRequest {
  message: string;
  botData: BotData;
  conversationHistory: Message[];
}

export interface ChatResponse {
  message: string;
  error?: string;
}
