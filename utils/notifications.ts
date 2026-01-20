import notifee, { AndroidImportance, RepeatFrequency, TimestampTrigger, TriggerType } from '@notifee/react-native';

const CHANNEL_ID = 'gr8life-reminders';
const REMINDER_NOTIFICATION_ID = 'daily-check-in';

export async function requestNotificationPermissions() {
    await notifee.requestPermission();
}

export async function scheduleReminder(time: Date, frequency: 'Daily' | 'Weekly', dayOfWeek?: number) {
    // 1. Request permissions (if not already granted)
    await requestNotificationPermissions();

    // 2. Create a channel (required for Android)
    await notifee.createChannel({
        id: CHANNEL_ID,
        name: 'Check-in Reminders',
        importance: AndroidImportance.HIGH,
        sound: 'default', // Using default sound for now, customization can be added later
    });

    // 3. Calculate trigger time
    // Ensure the time is in the future. If the time has passed for today, schedule for tomorrow (Daily) or next week (Weekly).
    let triggerDate = new Date(Date.now());
    triggerDate.setHours(time.getHours());
    triggerDate.setMinutes(time.getMinutes());
    triggerDate.setSeconds(0);
    triggerDate.setMilliseconds(0);

    if (frequency === 'Weekly' && dayOfWeek !== undefined) {
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

        // Special case: if difference > 0, we just add difference.
        // But we need to make sure we don't schedule in the past if it's "today" earlier.
        // The logic above handles Today (diff=0).
        // For future days (diff > 0), simple add works.
        // For past days (diff < 0), add 7 + diff works (e.g. Today Mon(1), Target Sun(0). Diff -1. Add 6. Mon+6=Sun).

        triggerDate.setDate(triggerDate.getDate() + daysToAdd);

    } else {
        // Daily, or Weekly without day specified (shouldn't happen with UI enforcement)
        if (triggerDate.getTime() <= Date.now()) {
            if (frequency === 'Daily') {
                triggerDate.setDate(triggerDate.getDate() + 1);
            } else {
                // Fallback for weekly if no day set, just next week
                triggerDate.setDate(triggerDate.getDate() + 7);
            }
        }
    }

    // 4. Create the trigger
    const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerDate.getTime(),
        repeatFrequency: frequency === 'Daily' ? RepeatFrequency.DAILY : RepeatFrequency.WEEKLY,
    };

    // 5. Create/Update the trigger notification
    await notifee.createTriggerNotification(
        {
            id: REMINDER_NOTIFICATION_ID,
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

    console.log(`Notification scheduled for ${triggerDate.toISOString()} repeating ${frequency}`);
}

export async function cancelReminders() {
    await notifee.cancelNotification(REMINDER_NOTIFICATION_ID);
    console.log('Notification cancelled');
}
