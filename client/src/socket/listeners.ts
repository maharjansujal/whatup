import type { Message } from "../types/message";
import socket from "./socket";
import { SOCKET_EVENTS } from "./socket_events";

export function registerSocketListeners(onMessage: (msg: Message) => void) {
  socket.on(SOCKET_EVENTS.MESSAGE_RECEIVE, (message) => {
    onMessage(message);
  });

  socket.on(SOCKET_EVENTS.USER_ONLINE, (userId) => {
    console.log("User online:", userId);
  });

  socket.on(SOCKET_EVENTS.USER_OFFLINE, (userId) => {
    console.log("User offline:", userId);
  });
}

export function cleanupSocketListeners() {
  socket.off(SOCKET_EVENTS.MESSAGE_RECEIVE);
  socket.off(SOCKET_EVENTS.USER_ONLINE);
  socket.off(SOCKET_EVENTS.USER_OFFLINE);
}
