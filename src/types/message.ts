export interface Message {
  id: string;
  content: string;
  type: 'text' | 'voice';
  created_at: string;
  sender_id: string;
  sender: {
    username: string;
    avatar_url?: string;
  };
}