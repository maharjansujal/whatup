export const SocketEvents = {
  NEW_MESSAGE: "newMessage",

  MESSAGE_UPDATED: "messageUpdated",

  MESSAGE_SEEN: "messageSeen",

  MESSAGE_SEEN_UPDATE: "messageSeenUpdate",

  TYPING: "typing",

  USER_TYPING: "userTyping",

  STOP_TYPING: "stopTyping",

  USER_STOPPED_TYPING: "userStoppedTyping",

  BULK_DELIVERY: "messagesDeliveredBulk",

  GET_ONLINE_USERS: "getOnlineUsers",
} as const;
