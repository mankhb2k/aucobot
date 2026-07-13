export interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
  read: boolean;
}

export interface Chat {
  id: string;
  name: string;
  status: string;
  avatarText?: string;
  avatarBg?: string;
  avatarUrl?: string;
  isChannel?: boolean;
  phone?: string;
  notifications: boolean;
  messages: Message[];
  sharedMedia: string[];
}
