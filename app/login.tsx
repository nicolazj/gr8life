import { useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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

  const primaryColor = '#2D8C7F'; // Teal from design
  const secondaryColor = '#E0F2F1'; // Light teal background

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
      const { supportedFirstFactors } = await signIn.create({
        identifier: email,
      });

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
      <View style={styles.header}>
        <View></View>
        <Text style={styles.headerTitle}>SIGN IN</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <MaterialCommunityIcons name="infinity" size={40} color="#2D8C7F" />
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Welcome to Gr8Life
            </Text>
            <Text style={styles.subtitle}>
              {step === 'code'
                ? `Enter the code sent to ${email}`
                : 'Enter your email to receive a secure code for a frictionless login.'}
            </Text>
          </View>

          <View style={styles.form}>
            {step === 'email' ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="name@example.com"
                    placeholderTextColor="#9ca3af"
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
                    <View style={styles.buttonContent}>
                      <Text style={styles.buttonText}>Continue</Text>
                    </View>
                  )}
                </TouchableOpacity>




              </>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <TextInput
                    style={[styles.input, { textAlign: 'center', letterSpacing: 8, fontSize: 24 }]}
                    placeholder="123456"
                    placeholderTextColor="#9ca3af"
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
                  <Text style={[styles.linkText, { color: primaryColor }]}>
                    Change Email
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>


          <View style={styles.legalFooter}>
            <Text style={styles.legalText}>Privacy Policy   |   Terms of Service</Text>
          </View>

        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FAF9', // Very light mint/teal background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  keyboardView: {
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 40,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#CFE8E5', // Light teal icon bg
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#11181C',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 56,
    backgroundColor: '#FFF',
    borderRadius: 28, // Pill shape
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2D8C7F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 32,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orText: {
    marginHorizontal: 16,
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    letterSpacing: 1,
  },
  socialButtons: {
    gap: 16,
    marginBottom: 48,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: '#FFF',
    borderRadius: 28,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  footerText: {
    color: '#64748B',
    fontSize: 14,
  },
  footerLink: {
    fontWeight: '700',
    fontSize: 14,
  },
  legalFooter: {
    alignItems: 'center',
  },
  legalText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  textButton: {
    padding: 16,
    alignItems: 'center',
  },
  linkText: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
