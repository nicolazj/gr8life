import { IconSymbol } from '@/components/ui/icon-symbol';
import { api } from '@/convex/_generated/api';
import { DIMENSION_CONFIG, type Dimension } from '@/convex/schema';
import { useMutation } from 'convex/react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ACTION_COLOR = '#30837D'; // Green/Teal color from the image

export default function DimensionDetailScreen() {
  const { dimension } = useLocalSearchParams<{ dimension?: Dimension }>();
  const router = useRouter();
  const config = dimension ? DIMENSION_CONFIG[dimension] : null;
  const createEntry = useMutation(api.entries.createEntry);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!dimension || !content.trim()) return;

    try {
      setIsSubmitting(true);
      await createEntry({ dimension, content });
      setContent('');
      router.back();
    } catch (error) {
      console.error('Failed to create entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!config) return null;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Reflection",
          headerShown: true,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#000',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8 }}>
              <IconSymbol name="chevron.left" size={28} color="#000" />
            </TouchableOpacity>
          ),
          headerBackVisible: false, // We use custom left button for exact control look

        }}
      />

      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={[styles.heroIconContainer, { backgroundColor: `${config.color}15` }]}>
              <IconSymbol
                size={48}
                name={config.icon}
                color={config.color}
              />
            </View>
            <Text style={styles.heroTitle}>{config.name}</Text>
            <Text style={styles.heroSubtitle}>{config.description}</Text>
          </View>

          {/* Reflection Section */}
          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="edit" size={20} color={ACTION_COLOR} />
              <Text style={styles.sectionLabel}>REFLECTION</Text>
            </View>

            <View style={styles.inputCard}>
              <TextInput
                style={styles.textInput}
                value={content}
                onChangeText={setContent}
                placeholder="How was your progress this week? Any new habits or breakthroughs? Write freely about your physical state, energy levels, and health choices."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
              />
              <Text style={styles.helperText}>Mindful writing recommended</Text>
            </View>
          </View>

          {/* Quote Section */}
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              "Take a deep breath. Be honest with yourself—growth happens in the spaces of reflection, not just in the numbers."
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: ACTION_COLOR }]}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <View style={styles.checkIconWrapper}>
                  <IconSymbol name="check" size={18} color={ACTION_COLOR} />
                </View>
                <Text style={styles.submitButtonText}>Complete Check-in</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Light gray/off-white background
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100, // Space for footer
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  heroIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 30, // Squircle-ish
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800', // Extra bold
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: '80%',
    lineHeight: 24,
  },
  formSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: ACTION_COLOR,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    minHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    position: 'relative',
  },
  textInput: {
    fontSize: 17,
    lineHeight: 26,
    color: '#374151',
    flex: 1,
    marginBottom: 20,
  },
  helperText: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    fontSize: 13,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  quoteCard: {
    backgroundColor: '#EFF6F5', // Very light green/gray
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E0EBEA',
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#4B6A68', // Muted teal-ish gray
    fontStyle: 'italic',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40, // More padding for bottom safe area visual balance
    backgroundColor: 'rgba(249,250,251,0.9)', // Semi-transparent background matching container
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: ACTION_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    gap: 12,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  checkIconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
