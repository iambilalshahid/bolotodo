import * as IntentLauncher from 'expo-intent-launcher';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { requestAlarmPermissions } from './permissions';

export interface ScheduleReminderOptions {
  id: string;
  title: string;
  body: string;
  date: Date;
  setAndroidNativeClock?: boolean;
}

export async function scheduleTodoAlarm(
  options: ScheduleReminderOptions
): Promise<{ mainNotificationId: string | null; followupNotificationId: string | null }> {
  const hasPermission = await requestAlarmPermissions();
  if (!hasPermission) {
    console.warn('Notification permissions denied. Alarm not scheduled.');
    return { mainNotificationId: null, followupNotificationId: null };
  }

  const triggerDate = new Date(options.date);
  const now = Date.now();
  if (triggerDate.getTime() <= now) {
    console.warn('Alarm trigger date is in the past. Skipping schedule.');
    return { mainNotificationId: null, followupNotificationId: null };
  }

  // 1. Schedule 10-Minute Prior Followup Reminder
  let followupNotificationId: string | null = null;
  const TEN_MINUTES_MS = 10 * 60 * 1000;
  const followupTime = triggerDate.getTime() - TEN_MINUTES_MS;

  // Only schedule followup if reminder is more than 10 minutes away
  if (followupTime > now) {
    try {
      followupNotificationId = await Notifications.scheduleNotificationAsync({
        identifier: `${options.id}-followup`,
        content: {
          title: `⏳ Reminder: 10 mins to ${options.title}`,
          body: `Upcoming task in 10 minutes: ${options.body}`,
          sound: 'default',
          data: { todoId: options.id, isFollowup: true },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(followupTime),
          channelId: 'bolotodo-reminders',
        },
      });
    } catch (err) {
      console.warn('Failed to schedule 10m followup reminder:', err);
    }
  }

  // 2. Schedule Main Exact Alarm / Notification via expo-notifications
  const mainNotificationId = await Notifications.scheduleNotificationAsync({
    identifier: options.id,
    content: {
      title: options.title,
      body: options.body,
      sound: 'default',
      data: { todoId: options.id, isMain: true },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
      channelId: 'bolotodo-reminders',
    },
  });

  // 3. Android: Attempt Native Clock Alarm Intent (handled safely without throwing "no apps can perform" error)
  if (Platform.OS === 'android' && options.setAndroidNativeClock) {
    try {
      await IntentLauncher.startActivityAsync('android.intent.action.SET_ALARM', {
        extra: {
          'android.intent.extra.alarm.HOUR': triggerDate.getHours(),
          'android.intent.extra.alarm.MINUTES': triggerDate.getMinutes(),
          'android.intent.extra.alarm.MESSAGE': options.title,
          'android.intent.extra.alarm.SKIP_UI': true,
        },
      });
    } catch {
      // In Expo Go or custom Android skins (Tecno HiOS / Infinix XOS),
      // the native OEM clock app restricts third-party SET_ALARM intents.
      // The scheduled expo-notification above handles the actual ringing.
    }
  }

  return { mainNotificationId, followupNotificationId };
}

export async function cancelTodoAlarm(id: string): Promise<void> {
  // Cancel both main alarm and the 10m followup reminder
  await Promise.all([
    Notifications.cancelScheduledNotificationAsync(id).catch(() => { }),
    Notifications.cancelScheduledNotificationAsync(`${id}-followup`).catch(() => { }),
  ]);
}