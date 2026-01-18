import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  View,
  ScrollView,
  Alert,
  LayoutAnimation,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSignIn, useSignUp, useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';

// Warm up the browser for OAuth
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, setActive: setSignInActive, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: isSignUpLoaded } = useSignUp();
  
  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleFlow } = useOAuth({ strategy: 'oauth_apple' });

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');

  const primaryColor = useThemeColor({}, 'tint');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');
  
  const toggleMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSignup(!isSignup);
    setEmail('');
    setPassword('');
    Keyboard.dismiss();
  };

  const onSignInPress = async () => {
    if (!isSignInLoaded) return;
    setLoading(true);
    Keyboard.dismiss();

    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      if (completeSignIn.status === 'complete') {
        await setSignInActive({ session: completeSignIn.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(completeSignIn, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Error', err.errors ? err.errors[0].message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onSignUpPress = async () => {
    if (!isSignUpLoaded) return;
    setLoading(true);
    Keyboard.dismiss();

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Error', err.errors ? err.errors[0].message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isSignUpLoaded) return;
    setLoading(true);
    Keyboard.dismiss();

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setSignUpActive({ session: completeSignUp.createdSessionId });
        router.replace('/');
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Error', err.errors ? err.errors[0].message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onSelectOAuth = async (strategy: 'google' | 'apple') => {
    try {
      setLoading(true);
      const startOAuth = strategy === 'google' ? startGoogleFlow : startAppleFlow;
      
      const { createdSessionId, setActive } = await startOAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace('/');
      }
    } catch (err) {
      console.error('OAuth error', err);
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flex1}>
          <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <Text >Verify Email</Text>
            <Text style={styles.subtitle}>
              We sent a verification code to {email}
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: iconColor }]}
              placeholder="Verification Code"
              placeholderTextColor={iconColor}
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
            />
            
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: primaryColor }]} 
              onPress={onPressVerify}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify Email</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flex1}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <Text >
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text style={styles.subtitle}>
              {isSignup 
                ? 'Sign up to get started' 
                : 'Sign in to continue to your account'}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: iconColor }]}
                placeholder="hello@example.com"
                placeholderTextColor={iconColor}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, { color: textColor, borderColor: iconColor }]}
                placeholder="••••••••"
                placeholderTextColor={iconColor}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, { backgroundColor: primaryColor }]} 
              onPress={isSignup ? onSignUpPress : onSignInPress}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isSignup ? 'Sign Up' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={[styles.line, { backgroundColor: iconColor }]} />
              <Text style={styles.orText}>or continue with</Text>
              <View style={[styles.line, { backgroundColor: iconColor }]} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity 
                style={[styles.socialButton, { borderColor: iconColor }]}
                onPress={() => onSelectOAuth('google')}
              >
                <FontAwesome name="google" size={24} color={textColor} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.socialButton, { borderColor: iconColor }]}
                onPress={() => onSelectOAuth('apple')}
              >
                <FontAwesome name="apple" size={24} color={textColor} />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {isSignup ? 'Already have an account?' : "Don't have an account?"}
              </Text>
              <TouchableOpacity onPress={toggleMode}>
                <Text style={[styles.linkText, { color: primaryColor }]}>
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.6,
    fontSize: 16,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  line: {
    flex: 1,
    height: 1,
    opacity: 0.2,
  },
  orText: {
    marginHorizontal: 16,
    opacity: 0.6,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    gap: 10,
    opacity: 0.8,
  },
  socialButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    opacity: 0.6,
  },
  linkText: {
    fontWeight: '600',
  },
});
