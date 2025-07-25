// ✅ User type for defining the structure of a user object
export interface User {
  id: string;
  username: string;
  isOnline?: boolean;
  profilePic?: string;
}

// ✅ Enum to clearly define allowed message types
export type MessageType = 'text' | 'image' | 'video' | 'audio';

// ✅ ChatMessage type, updated for media support
export interface ChatMessage {
  id: string;
  sender: string;
  receiver: string;
  content: string; // ⬅️ renamed from `text` to `content`
  type: MessageType;
  timestamp?: Date | string;
}
