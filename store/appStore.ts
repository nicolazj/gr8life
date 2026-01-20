import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppState {
    hasFinishedOnboarding: boolean;
    setHasFinishedOnboarding: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            hasFinishedOnboarding: false,
            setHasFinishedOnboarding: (value) => set({ hasFinishedOnboarding: value }),
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
