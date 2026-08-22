import { io } from "socket.io-client";

export function createSocket(token: string) {
  return io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    auth: {
      token
    }
  });
}
