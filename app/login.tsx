import { useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';

// Warm up the browser for OAuth
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, setActive: setSignInActive, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: isSignUpLoaded } = useSignUp();

  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleFlow } = useOAuth({ strategy: 'oauth_apple' });

  const [isSignup, setIsSignup] = useState(false);
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const primaryColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  const onChangeEmail = () => {
    setStep('email');
    setEmail('');
    setCode('');
    setIsSignup(false);
    Keyboard.dismiss();
  };

  const onContinue = async () => {
    if (!isSignInLoaded || !isSignUpLoaded) return;
    setLoading(true);
    Keyboard.dismiss();

    try {
      // First, try to sign in
      const { supportedFirstFactors } = await signIn.create({
        identifier: email,
      });

      // If successful (no error thrown), it's an existing user
      setIsSignup(false);

      const emailCodeFactor = supportedFirstFactors?.find(
        (factor: any) => factor.strategy === 'email_code'
      );

      if (emailCodeFactor) {
        const { emailAddressId } = emailCodeFactor as any;
        await signIn.prepareFirstFactor({
          strategy: 'email_code',
          emailAddressId,
        });
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setStep('code');
      } else {
        Alert.alert('Error', 'Email login not enabled for this account. Please use a different method.');
      }

    } catch (err: any) {
      // If user not found, switch to sign up flow
      if (err.errors?.[0]?.code === 'form_identifier_not_found') {
        setIsSignup(true);
        try {
          await signUp.create({
            emailAddress: email,
          });
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setStep('code');
        } catch (signUpErr: any) {
          console.error(JSON.stringify(signUpErr, null, 2));
          Alert.alert('Error', signUpErr.errors ? signUpErr.errors[0].message : 'Could not create account');
        }
      } else {
        console.error(JSON.stringify(err, null, 2));
        Alert.alert('Error', err.errors ? err.errors[0].message : 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async () => {
    if (!isSignInLoaded || !isSignUpLoaded) return;
    setLoading(true);
    Keyboard.dismiss();

    try {
      if (isSignup) {
        // Verify Sign Up
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code,
        });

        if (completeSignUp.status === 'complete') {
          await setSignUpActive({ session: completeSignUp.createdSessionId });
          router.replace('/');
        } else {
          console.error(JSON.stringify(completeSignUp, null, 2));
          Alert.alert('Error', 'Verification failed. Please try again.');
        }
      } else {
        // Verify Sign In
        const completeSignIn = await signIn.attemptFirstFactor({
          strategy: 'email_code',
          code,
        });

        if (completeSignIn.status === 'complete') {
          await setSignInActive({ session: completeSignIn.createdSessionId });
          router.replace('/');
        } else {
          console.error(JSON.stringify(completeSignIn, null, 2));
          Alert.alert('Error', 'Verification failed. Please try again.');
        }
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Error', err.errors ? err.errors[0].message : 'Invalid code');
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flex1}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.header}>
              <Text style={[styles.title, { color: textColor }]}>
                {step === 'code' ? 'Verify Email' : 'Welcome'}
              </Text>
              <Text style={styles.subtitle}>
                {step === 'code'
                  ? `Enter the code sent to ${email}`
                  : 'Enter your email to continue'}
              </Text>
            </View>

            <View style={styles.form}>
              {step === 'email' ? (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: textColor }]}>Email</Text>
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

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: primaryColor }]}
                    onPress={onContinue}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Continue</Text>
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
                      <Text style={[styles.socialButtonText, { color: textColor }]}>Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.socialButton, { borderColor: iconColor }]}
                      onPress={() => onSelectOAuth('apple')}
                    >
                      <FontAwesome name="apple" size={24} color={textColor} />
                      <Text style={[styles.socialButtonText, { color: textColor }]}>Apple</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.footer} />
                </>
              ) : (
                <>
                  <View style={styles.inputGroup}>
                    <TextInput
                      style={[styles.input, { color: textColor, borderColor: iconColor, textAlign: 'center', letterSpacing: 8, fontSize: 24 }]}
                      placeholder="123456"
                      placeholderTextColor={iconColor}
                      value={code}
                      onChangeText={setCode}
                      keyboardType="number-pad"
                      maxLength={6}
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: primaryColor }]}
                    onPress={onVerify}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Verify Email</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.textButton]}
                    onPress={onChangeEmail}
                    disabled={loading}
                  >
                    <Text style={[styles.linkText, { color: primaryColor, textAlign: 'center' }]}>
                      Change Email
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.6,
    fontSize: 16,
    textAlign: 'center',
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
  textButton: {
    padding: 16,
    alignItems: 'center',
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

  linkText: {
    fontWeight: '600',
  },
});
