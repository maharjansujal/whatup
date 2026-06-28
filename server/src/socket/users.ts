const userSocketMap = new Map<number, string>();

export function registerUser(userId: number, socketId: string) {
  userSocketMap.set(userId, socketId);
}

export function removeUser(userId: number) {
  userSocketMap.delete(userId);
}

export function getUserSocket(userId: number) {
  return userSocketMap.get(userId);
}
