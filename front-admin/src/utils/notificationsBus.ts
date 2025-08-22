// utils/notificationsBus.ts
export const notificationsBus = new EventTarget();

export const emitNotificationsUpdated = () => {
  notificationsBus.dispatchEvent(new Event("notifications:updated"));
};
