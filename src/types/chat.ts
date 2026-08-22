export type ChatUser = {
  _id: string;
  name: string;
  phone: string;
};

export type Conversation = {
  _id: string;
  type: "direct";
  lastMessage?: {
    text?: string;
  };
  updatedAt: string;
  participant: ChatUser;
};
