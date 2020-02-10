import {Component, h, Listen, Prop, State, Watch} from '@stencil/core';
import {Toast} from "../toast/toast";
import {Notification, NotificationType} from "./models";

interface TaggedNotification {
  id: string
  notification: Notification
}

@Component({
  tag: 'elsa-notifications',
  styleUrl: 'notifications.scss',
  scoped: true
})
export class Notifications {

  private seed: number = 1;

  @Prop() notifications: Array<Notification> = [];
  @State() stack: Array<TaggedNotification> = [];

  @Watch('notifications')
  notificationsWatcher(newValue: Array<Notification>) {
    const newNotifications = newValue.map(x => ({id: `notification-${this.seed++}`, notification: x}));
    this.stack = [...this.stack, ...newNotifications];
  }

  @Listen('hidden.bs.toast')
  toastHiddenHandler(e: CustomEvent) {
    const target = e.target as HTMLBsToastElement;
    const id = target.id;
    this.stack = this.stack.filter(x => x.id !== id);
    target.parentNode.removeChild(target);
  }

  private static getIcon(notificationType: NotificationType): string {
    switch (notificationType) {
      case NotificationType.Success:
        return 'fas fa-check';
      case NotificationType.Warning:
        return 'fas fa-exclamation-triangle';
      case NotificationType.Error:
        return 'fas fa-bomb';
      case NotificationType.Information:
      default:
        return 'fas fa-info-circle';
    }
  }

  private renderNotification = (taggedNotification: TaggedNotification) => {
    const id = taggedNotification.id;
    const notification = taggedNotification.notification;
    const icon = Notifications.getIcon(notification.type);
    return (
      <Toast id={id} title={notification.title} icon={icon}>
        <div>{notification.message}</div>
      </Toast>
    )
  };

  render() {
    const notifications = this.stack || [];

    return (
      <div style={{position: "fixed", top: "5em", right: "2em"}}>
        {notifications.map(this.renderNotification)}
      </div>
    );
  }

}
