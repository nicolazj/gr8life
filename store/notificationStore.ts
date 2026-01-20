import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface NotificationState {
    remindersEnabled: boolean;
    frequency: 'Daily' | 'Weekly';
    reminderTime: string; // ISO string to be safe with AsyncStorage
    reminderDay: number; // 0 = Sunday, 1 = Monday, etc.
    toggleReminders: (value: boolean) => void;
    setFrequency: (frequency: 'Daily' | 'Weekly') => void;
    setReminderTime: (time: string) => void;
    setReminderDay: (day: number) => void;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set) => ({
            remindersEnabled: true,
            frequency: 'Daily',
            reminderTime: new Date().toISOString(),
            reminderDay: new Date().getDay(), // Default to today
            toggleReminders: (value) => set({ remindersEnabled: value }),
            setFrequency: (frequency) => set({ frequency }),
            setReminderTime: (time) => set({ reminderTime: time }),
            setReminderDay: (day) => set({ reminderDay: day }),
        }),
        {
            name: 'notification-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
