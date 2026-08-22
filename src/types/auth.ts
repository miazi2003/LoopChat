export type User = {
  _id: string;
  name: string;
  phone: string;
  createdAt: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};
