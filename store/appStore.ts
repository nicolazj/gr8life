import { DIMENSION_INSPIRATIONS, Inspiration } from '@/constants/inspirations';
import { Dimension, DIMENSIONS } from '@/convex/schema';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppState {
    hasFinishedOnboarding: boolean;
    hasHydrated: boolean;
    inspirations: Record<Dimension | string, Inspiration[]>;
    setHasFinishedOnboarding: (value: boolean) => void;
    setHasHydrated: (value: boolean) => void;
    setInspirations: (dimension: Dimension | string, inspirations: Inspiration[]) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            hasFinishedOnboarding: false,
            hasHydrated: false,
            inspirations: processInitialInspirations(),
            setHasFinishedOnboarding: (value) => set({ hasFinishedOnboarding: value }),
            setHasHydrated: (value) => set({ hasHydrated: value }),
            setInspirations: (dimension, newInspirations) =>
                set((state) => ({
                    inspirations: { ...state.inspirations, [dimension]: newInspirations }
                })),
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

// Helper to remove icon/color from initial constants if needed, or just map them
function processInitialInspirations(): Record<Dimension | string, Inspiration[]> {
    const processed: Record<string, Inspiration[]> = {};
    Object.values(DIMENSIONS).forEach((dim) => {
        const raw = DIMENSION_INSPIRATIONS[dim] || [];
        processed[dim] = raw.map(item => ({
            title: item.title,
            description: item.description
        }));
    });
    return processed;
}
