import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { clerkTokenCache } from '@/lib/token-cache';

SplashScreen.preventAutoHideAsync();

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL || '', {
  unsavedChangesWarning: false,
});

function ConvexClientWithAuth({ children }: { children: React.ReactNode }) {
  const { isLoaded, getToken, isSignedIn } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const configureConvexAuth = async () => {
      const token = await getToken({ template: 'convex' });

      console.log({ token })
      if (token) {
        convex.setAuth(async () => token);
        setIsAuthenticated(true);
      } else {
        convex.setAuth(async () => null);
        setIsAuthenticated(false);
      }
    };

    configureConvexAuth();
  }, [isLoaded, getToken]);

  return <>{children}</>;
}



export default function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
    );
  }

  return (
    <SafeAreaProvider>
      <ClerkProvider tokenCache={clerkTokenCache} publishableKey={publishableKey}>
        <ClerkLoaded>
          <ConvexClientWithAuth>
            <ConvexProvider client={convex}>
              <ThemeProvider value={DefaultTheme}>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                  <Stack.Screen name="entry/[id]" options={{ presentation: 'modal', headerShown: false }} />
                  <Stack.Screen name="personal-info" options={{ headerShown: false }} />
                  <Stack.Screen name="login" options={{ headerShown: false }} />
                  <Stack.Screen name="setup" options={{ headerShown: false }} />
                  <Stack.Screen name="notification-preferences" options={{ headerShown: false }} />
                  <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="dimension/[dimension]/check-in" options={{ headerShown: false }} />
                  <Stack.Screen name="dimension/[dimension]/index" options={{ headerShown: false }} />
                </Stack>
                <StatusBar style="auto" />
              </ThemeProvider>
            </ConvexProvider>
          </ConvexClientWithAuth>
        </ClerkLoaded>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}
