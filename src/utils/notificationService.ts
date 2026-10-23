import { audioService } from './audioService';

export class NotificationService {
  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public static getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public static async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch {
      return 'denied';
    }
  }

  public static sendNotification(title: string, options?: NotificationOptions & { playSound?: boolean }) {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });

      if (options?.playSound !== false) {
        audioService.playAdhan();
      }

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch {
      // In some mobile browsers, new Notification() throws without a service worker
      if (options?.playSound !== false) {
        audioService.playAdhan();
      }
    }
  }

  public static testAlarm(title: string = 'Test Prayer Alarm (Hamdeen)') {
    if (this.isSupported() && Notification.permission === 'granted') {
      this.sendNotification(title, {
        body: 'It is time for prayer. Hayya ‘ala-s-Salah. (May Allah accept your prayers)',
        playSound: true,
      });
    } else {
      audioService.playAdhan();
    }
  }
}
