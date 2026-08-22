export type ChatUser = {
  _id: string;
  name: string;
  phone: string;
};

export type Conversation = {
  _id: string;
  type: "direct" | "group";
  name?: string;
  createdBy?: string;
  admins?: string[];
  participants?: ChatUser[];
  lastMessage?: {
    text?: string;
  };
  updatedAt: string;
  participant?: ChatUser;
};

export type Message = {
  id: string;
  conversation: string;
  sender: string;
  text: string;
  createdAt: string | number;
};
