export interface ChatMessageProps {
  id: string;
  content: string;
  isUser: boolean;
}

export interface MessageForm {
  prompt: string;
}

export interface TypewriteMessageProps {
  content: string;
  shouldTypewrite: boolean;
}
