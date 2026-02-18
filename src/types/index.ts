export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Message {
  id: string;
  message: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  is_read: boolean;
  sender?: User;
  receiver?: User;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "created_at"> & { created_at?: string };
        Update: Partial<User>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, "id" | "created_at" | "is_read"> & {
          id?: string;
          created_at?: string;
          is_read?: boolean;
        };
        Update: Partial<Message>;
      };
    };
  };
}
