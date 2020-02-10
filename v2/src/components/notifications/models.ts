export enum NotificationType {
  Information,
  Success,
  Warning,
  Error
}

export interface Notification {
  title: string
  message: string
  type: NotificationType
}
