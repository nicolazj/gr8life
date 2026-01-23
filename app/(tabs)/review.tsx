import { IconSymbol } from '@/components/ui/icon-symbol';
import { api } from '@/convex/_generated/api';
import { DIMENSION_CONFIG } from '@/convex/schema';
import { useUser } from '@clerk/clerk-expo';

import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReviewScreen() {
  const router = useRouter();
  const { user } = useUser();
  const date = new Date();
  const dateString = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const allCompletion = useQuery(api.entries.entryCompletion, { startTimestamp: 0 });

  const sortedDimensions = React.useMemo(() => {
    if (!allCompletion) return [];

    return Object.entries(DIMENSION_CONFIG)
      .map(([key, config]) => ({
        key,
        ...config,
        count: (allCompletion as Record<string, number>)[key] || 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [allCompletion]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero Card */}
        <View style={styles.heroCard}>

          <View style={styles.heroBackground}>
            {/* Abstract blobs */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />
            <View style={styles.blob3} />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.dateText}>{dateString}</Text>
            <Text style={styles.greetingText}>
              {getGreeting()}, {user?.firstName || 'User'}.
            </Text>
            <Text style={styles.subtitleText}>
              Let's find your center today.
            </Text>
          </View>
        </View>

        {/* <LifeSummaryCard completionData={allCompletion as Record<string, number> | undefined} /> */}

        {/* Life Aspect Leaderboard */}
        <View style={styles.leaderboardSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.leaderboardCard}>
            {sortedDimensions.map((item, index) => {
              const maxCount = Math.max(sortedDimensions[0]?.count || 0, 1);
              const percentage = (item.count / maxCount) * 100;

              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => router.push(`/dimension/${item.key}`)}
                  style={[
                    styles.leaderboardItem,
                    index === sortedDimensions.length - 1 && styles.lastItem
                  ]}
                >
                  <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                    <IconSymbol size={20} name={item.icon} color={item.color} />
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.progressTrack}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${percentage}%`, backgroundColor: item.color }
                        ]}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
            {sortedDimensions.length === 0 && (
              <Text style={styles.emptyText}>No entries yet. Start logging!</Text>
            )}
          </View>
        </View>

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />

      </ScrollView>
    </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FAF9', // Light pastel background
  },
  scrollContent: {
    padding: 20,
  },
  heroCard: {
    height: 240,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
    backgroundColor: '#8d7c6e', // Fallback brown
  },
  heroBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#AD9A85', // Muted brownish base
  },
  // Blobs for the "liquid" feel in the hero
  blob1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#C58F68', // Orange-brown
    top: -50,
    right: -50,
    opacity: 0.8,
  },
  blob2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#2D4F4D', // Dark teal
    bottom: -80,
    left: -40,
    opacity: 0.6,
  },
  blob3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2D8C7F', // Brighter teal
    top: 40,
    left: 40,
    opacity: 0.2,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  dateText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greetingText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  subtitleText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
    minHeight: 140,
  },
  cardTitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 8,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },
  bigNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#11181C',
  },
  trendPositive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#22C55E', // Green
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginTop: 'auto',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2D8C7F', // Teal
    borderRadius: 3,
  },
  focusTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#11181C',
    marginBottom: 4,
  },
  focusSubtitle: {
    fontSize: 13,
    color: '#EF4444', // Red-ish for warning/alert focus
    fontWeight: '600',
    fontStyle: 'italic',
  },

  bold: {
    fontWeight: '700',
  },
  leaderboardSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  leaderboardCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  lastItem: {
    marginBottom: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemName: {
    minWidth: 80,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  emptyText: {
    padding: 20,
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
  },
});
