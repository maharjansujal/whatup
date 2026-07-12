import type { User } from "../types/user";

export function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission === "default") {
    Notification.requestPermission();
  }
}

export function showNotification({
  title,
  body,
  icon,
  onClick,
}: {
  title: string;
  body: string;
  icon?: string;
  onClick?: () => void;
}) {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  const notification = new Notification(title, {
    body,
    icon,
  });

  notification.onclick = () => {
    window.focus();
    onClick?.();
    notification.close();
  };
}

export function canShowNotification(user?: User) {
  return (
    document.hidden &&
    Notification.permission === "granted" &&
    !user?.custom_status
  );
}
