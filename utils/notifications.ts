import notifee, { AndroidImportance, RepeatFrequency, TimestampTrigger, TriggerType } from '@notifee/react-native';

const CHANNEL_ID = 'gr8life-reminders';
const REMINDER_NOTIFICATION_ID = 'daily-check-in';

export async function requestNotificationPermissions() {
    await notifee.requestPermission();
}

export async function scheduleReminder(time: Date, days: number[]) {
    // 1. Request permissions (if not already granted)
    await requestNotificationPermissions();

    // 2. Create a channel (required for Android)
    await notifee.createChannel({
        id: CHANNEL_ID,
        name: 'Check-in Reminders',
        importance: AndroidImportance.HIGH,
        sound: 'default',
    });

    // Cancel any existing reminders first to avoid duplicates/stale schedules
    await cancelReminders();

    if (days.length === 0) {
        return;
    }

    // 3. Schedule a notification for each selected day
    for (const dayOfWeek of days) {
        let triggerDate = new Date(Date.now());
        triggerDate.setHours(time.getHours());
        triggerDate.setMinutes(time.getMinutes());
        triggerDate.setSeconds(0);
        triggerDate.setMilliseconds(0);

        const currentDay = triggerDate.getDay();
        const difference = dayOfWeek - currentDay;
        let daysToAdd = difference;

        if (difference < 0) {
            daysToAdd = 7 + difference;
        } else if (difference === 0) {
            // If it's the same day, check if time passed
            if (triggerDate.getTime() <= Date.now()) {
                daysToAdd = 7;
            }
        }

        triggerDate.setDate(triggerDate.getDate() + daysToAdd);

        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: triggerDate.getTime(),
            repeatFrequency: RepeatFrequency.WEEKLY,
        };

        // Unique ID for each day: daily-check-in-0, daily-check-in-1, etc.
        const notificationId = `${REMINDER_NOTIFICATION_ID}-${dayOfWeek}`;

        await notifee.createTriggerNotification(
            {
                id: notificationId,
                title: 'Time to check in!',
                body: 'Take a moment to reflect on your 8 pillars of life.',
                android: {
                    channelId: CHANNEL_ID,
                    pressAction: {
                        id: 'default',
                    },
                },
                ios: {
                    sound: 'default',
                }
            },
            trigger,
        );

        console.log(`Notification scheduled for ${triggerDate.toISOString()} (Day ${dayOfWeek})`);
    }
}

export async function cancelReminders() {
    // Cancel the single ID (legacy) and all possible day IDs
    await notifee.cancelNotification(REMINDER_NOTIFICATION_ID);
    const dayIds = [0, 1, 2, 3, 4, 5, 6].map(d => `${REMINDER_NOTIFICATION_ID}-${d}`);
    await Promise.all(dayIds.map(id => notifee.cancelNotification(id)));
    console.log('Notifications cancelled');
}
