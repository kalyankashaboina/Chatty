export interface User {
  id: string;
  username: string;
  isOnline?: boolean;
  profilePic?: string;
}

export type MessageType = 'text' | 'image' | 'video' | 'audio';

export interface ChatMessage {
  _id?: string;
  id: string;
  sender: string;
  receiver: string;
  content: string;
  type: MessageType;
  timestamp?: Date | string;
}
