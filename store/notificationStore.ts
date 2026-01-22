import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface NotificationState {
    reminderTime: string; // ISO string
    reminderDays: number[]; // 0 = Sunday, 1 = Monday, etc.
    setReminderTime: (time: string) => void;
    toggleReminderDay: (day: number) => void;
    setReminderDays: (days: number[]) => void;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set) => ({
            reminderTime: (() => {
                const d = new Date();
                d.setHours(20, 0, 0, 0);
                return d.toISOString();
            })(),
            reminderDays: [0], // Default to Sunday
            setReminderTime: (time) => set({ reminderTime: time }),
            toggleReminderDay: (day) => set((state) => {
                const days = state.reminderDays.includes(day)
                    ? state.reminderDays.filter((d) => d !== day)
                    : [...state.reminderDays, day];
                return { reminderDays: days.sort((a, b) => a - b) };
            }),
            setReminderDays: (days) => set({ reminderDays: days }),
        }),
        {
            name: 'notification-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
