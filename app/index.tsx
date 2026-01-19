import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function Bootstrap() {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded) return;

        const hasNavigated = () => {
            // Hide splash screen once we know where we are going
            SplashScreen.hideAsync();
        };

        if (isSignedIn) {
            router.replace('/(tabs)/');
            hasNavigated();
        } else {
            router.replace('/login');
            hasNavigated();
        }
    }, [isLoaded, isSignedIn]);

    return <View />;
}
