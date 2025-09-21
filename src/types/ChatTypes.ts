export interface ChatMessage {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: string;
  }
  
  export interface MessageForm {
    prompt: string;
  }