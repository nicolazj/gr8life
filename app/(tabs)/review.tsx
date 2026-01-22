import { IconSymbol } from '@/components/ui/icon-symbol';
import { api } from '@/convex/_generated/api';
import { DIMENSION_CONFIG, Dimension } from '@/convex/schema';
import { useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReviewScreen() {
  const { user } = useUser();
  const date = new Date();
  const dateString = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday
  const startTimestamp = startOfWeek.getTime();

  const weeklyCompletion = useQuery(api.entries.weeklyCompletion, { startTimestamp });

  // Calculate score: 1 point for each dimension > 0
  let score = 0;
  let maxDimension: Dimension | null = null;
  let maxCount = 0;

  if (weeklyCompletion) {
    const dimensionValues: number[] = [];
    Object.entries(weeklyCompletion).forEach(([key, value]) => {
      if (typeof value === 'number') {
        dimensionValues.push(value);
        if (value > maxCount) {
          maxCount = value;
          maxDimension = key as Dimension;
        }
      }
    });
    // Count dimensions with at least one entry
    score = dimensionValues.filter(v => v > 0).length;
  }
  // Cap score at 8 just in case
  score = Math.min(score, 8);

  // Determine Min Dimension (for Summary)
  let minDimension: Dimension | null = null;
  if (weeklyCompletion && score > 0) {
    let minCount = Infinity;
    // Check all configured dimensions, defaulting to 0 if not present in completion data
    (Object.keys(DIMENSION_CONFIG) as Dimension[]).forEach((dim) => {
      const count = weeklyCompletion[dim] || 0;
      if (count < minCount) {
        minCount = count;
        minDimension = dim;
      }
    });
  }

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

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {/* Current Balance Card */}
          <View style={styles.statCard}>
            <Text style={styles.cardTitle}>Current Balance</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.bigNumber}>{score}/8</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${(score / 8) * 100}%` }]} />
            </View>
          </View>

          {/* Weekly Focus Card */}
          <View style={styles.statCard}>
            <Text style={styles.cardTitle}>Weekly Focus</Text>
            <Text style={styles.focusTitle}>
              {maxDimension && DIMENSION_CONFIG[maxDimension] ? (DIMENSION_CONFIG as any)[maxDimension].name : 'N/A'}
            </Text>
            <Text style={styles.focusSubtitle}>
              {maxDimension ? 'Most active ' : 'No activity yet'}
            </Text>
          </View>
        </View>

        {/* Life Summary Card */}
        <View style={[styles.summaryCard]}>
          <View style={styles.cardHeader}>
            <IconSymbol name="sparkles" size={20} color="#2D8C7F" />
            <Text style={styles.cardHeaderTitle}>Life Summary</Text>
          </View>

          <Text style={styles.summaryText}>
            {maxDimension && minDimension ? (
              <>
                You've been highly productive in <Text style={styles.bold}>{(DIMENSION_CONFIG as any)[maxDimension].name}</Text> this week, but your <Text style={styles.bold}>{(DIMENSION_CONFIG as any)[minDimension].name}</Text> score is dipping. Time for a recalibration.
              </>
            ) : (
              "Start checking in to unlock your personalized life summary."
            )}
          </Text>
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
  summaryCard: {
    backgroundColor: '#E0F2F1', // Light teal mint
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#B2DFDB',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D8C7F',
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#11181C',
  },
  bold: {
    fontWeight: '700',
  },
});
