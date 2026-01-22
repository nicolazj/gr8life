import { useAppStore } from '@/store/appStore';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function Bootstrap() {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();
    const { hasFinishedOnboarding, hasHydrated } = useAppStore();

    useEffect(() => {
        if (!isLoaded || !hasHydrated) return;

        const hasNavigated = () => {
            // Hide splash screen once we know where we are going
            SplashScreen.setOptions({ fade: true, duration: 500 });
            SplashScreen.hideAsync();
        };

        if (!hasFinishedOnboarding) {
            router.replace('/onboarding');
            hasNavigated();
            return;
        }

        if (isSignedIn) {
            router.replace('/(tabs)');
            hasNavigated();
        } else {
            router.replace('/login');
            hasNavigated();
        }
    }, [isLoaded, isSignedIn, hasFinishedOnboarding, hasHydrated]);

    return <View />;
}
