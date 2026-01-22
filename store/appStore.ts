import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppState {
    hasFinishedOnboarding: boolean;
    hasHydrated: boolean;
    setHasFinishedOnboarding: (value: boolean) => void;
    setHasHydrated: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            hasFinishedOnboarding: false,
            hasHydrated: false,
            setHasFinishedOnboarding: (value) => set({ hasFinishedOnboarding: value }),
            setHasHydrated: (value) => set({ hasHydrated: value }),
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
