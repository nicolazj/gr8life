import { IconSymbol } from '@/components/ui/icon-symbol';
import { api } from '@/convex/_generated/api';
import { DIMENSION_CONFIG, type Dimension } from '@/convex/schema';
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const weeklyCompletion = useQuery(api.entries.weeklyCompletion);

  const getWeekInfo = () => {
    const now = new Date();
    // Hardcoded to match image for consistency if desired, but dynamic is better
    // For now, let's keep it dynamic but format it like the image
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Formatting to match "Oct 23 - Oct 29 • Week 43"
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const startStr = startOfWeek.toLocaleDateString('en-US', options);
    const endStr = endOfWeek.toLocaleDateString('en-US', options);

    // Week number calculation
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil(days / 7);

    return `${startStr} - ${endStr} • Week ${weekNumber}`;
  };

  const getCompletedCount = () => {
    if (!weeklyCompletion) {
      return 0;
    }
    const entries = Object.values(weeklyCompletion ?? {});
    return entries.filter((v) => v).length;
  };

  const getBalanceScore = () => {
    return Math.round((getCompletedCount() / 8) * 100);
  };

  const getPillarStatus = (dimensionKey: Dimension, isCompleted: boolean) => {
    const dimension = DIMENSION_CONFIG[dimensionKey];
    // These statuses match the image provided
    const statuses: Record<Dimension, { text: string; percentage: number }> = {
      transact: { text: 'Revenue Generation', percentage: 85 },
      invest: { text: 'Compound Returns', percentage: 60 },
      assist: { text: 'Helping Others', percentage: 40 },
      learn: { text: 'Continuous Growth', percentage: 92 },
      health: { text: 'Mind & Body', percentage: 75 },
      family: { text: 'Quality Time', percentage: 100 },
      relationships: { text: 'Network Building', percentage: 55 },
      ego: { text: 'Personal Joy', percentage: 30 },
    };
    return { ...dimension, ...statuses[dimensionKey] };
  };

  const renderDimensionCard = (dimensionKey: Dimension, isCompleted: boolean) => {
    const { name, color, text, percentage } = getPillarStatus(dimensionKey, isCompleted);

    // Mapping icons to match the image visually
    const iconNames: Record<Dimension, string> = {
      transact: 'attach-money', // specific icon
      invest: 'trending-up',
      assist: 'volunteer-activism',
      learn: 'school', // book/learn
      health: 'fitness-center', // dumbbell
      family: 'family-restroom',
      relationships: 'favorite', // heart
      ego: 'self-improvement', // meditation/person
    };

    return (
      <TouchableOpacity
        key={dimensionKey}
        style={styles.card}
        onPress={() => router.push(`/dimension/${dimensionKey}`)}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
            <IconSymbol size={24} name={iconNames[dimensionKey]} color={color} />
          </View>

        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{name}</Text>
          <Text style={styles.cardStatus}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SignedOut>
        <View style={styles.unauthContainer}>
          <Text style={styles.unauthText}>Sign in to track your life dimensions</Text>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SignedOut>

      <SignedIn>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.profileButton}>
              {user?.imageUrl ? (
                <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <IconSymbol name="person" size={20} color="#348578" />
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.headerTitle}>81-Framework</Text>
            <TouchableOpacity style={styles.notificationButton}>
              <IconSymbol size={24} name="notifications" color="#111827" />
            </TouchableOpacity>
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.pageTitle}>Your Week at a Glance</Text>
            <Text style={styles.dateSubtitle}>{getWeekInfo()}</Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity style={styles.ctaButton}>
            <View style={styles.ctaContent}>
              <View style={styles.ctaIconCircle}>
                <IconSymbol size={16} name="check" color="#348578" />
              </View>
              <Text style={styles.ctaButtonText}>Complete Weekly Check-in</Text>
            </View>
          </TouchableOpacity>

          {/* Balance Chart Card */}
          <View style={styles.balanceCard}>
            <View style={styles.chartContainer}>
              {/* Visual approximation of the radar chart */}
              <View style={[styles.chartCircle, styles.chartCircle1]} />
              <View style={[styles.chartCircle, styles.chartCircle2]} />
              <View style={[styles.chartCircle, styles.chartCircle3]} />
              <View style={styles.chartPolygon} />

              {/* Decorative graph line */}
              <View style={styles.miniGraph} />
            </View>
            <Text style={styles.balanceLabel}>
              HOLISTIC BALANCE: <Text style={styles.balanceValue}>{getBalanceScore()}%</Text>
            </Text>
          </View>

          {/* Pillars Grid */}
          <View style={styles.pillarsSection}>
            <Text style={styles.pillarsTitle}>Life Pillars Status</Text>
            <View style={styles.dimensionsGrid}>
              {Object.entries(DIMENSION_CONFIG).map(([key]) =>
                renderDimensionCard(key as Dimension, weeklyCompletion?.[key] ?? false)
              )}
            </View>
          </View>

          {/* Tip Card */}
          <View style={styles.tipCard}>
            <View style={styles.tipIconWrapper}>
              <IconSymbol size={24} name="lightbulb" color="#92400E" />
            </View>
            <View style={styles.tipTextContainer}>
              <Text style={styles.tipHeader}>Greatness Tip</Text>
              <Text style={styles.tipText}>
                You've prioritized Health and Learning this week. Consider a small "Family" connection today to maintain your holistic balance.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SignedIn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6', // Off-white background
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  unauthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  unauthText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  signInButton: {
    backgroundColor: '#30837D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 16,
  },
  signInButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  profileButton: {
    padding: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  notificationButton: {
    padding: 4,
  },
  // Title
  titleSection: {
    marginVertical: 16,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  dateSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  // CTA
  ctaButton: {
    backgroundColor: '#30837D', // Teal
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
    shadowColor: '#30837D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ctaIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Balance Card
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    minHeight: 280,
    justifyContent: 'space-between',
  },
  chartContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: 10,
  },
  chartCircle: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
  },
  chartCircle1: {
    width: 200,
    height: 200,
    borderColor: '#E0F2F1',
    backgroundColor: '#F0FDFA',
  },
  chartCircle2: {
    width: 140,
    height: 140,
    borderColor: '#B2DFDB',
    backgroundColor: '#E0F2F1',
  },
  chartCircle3: {
    width: 80,
    height: 80,
    borderColor: '#80CBC4',
    backgroundColor: '#B2DFDB',
  },
  chartPolygon: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: '#30837D',
    opacity: 0.6,
    borderRadius: 20, // Approximate polygon
    transform: [{ rotate: '45deg' }],
  },
  miniGraph: {
    position: 'absolute',
    right: -20,
    bottom: 40,
    // Decorative elements would usually be SVGs
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8CA3A1', // Muted teal-gray
    letterSpacing: 1,
    marginTop: 20,
    textTransform: 'uppercase',
  },
  balanceValue: {
    color: '#30837D',
    fontWeight: '800',
  },
  // Pillars
  pillarsSection: {
    marginBottom: 32,
  },
  pillarsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  dimensionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  card: {
    width: '48%', // Approx half minus gap
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  percentageText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardContent: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardStatus: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  // Tip Card
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB', // Light yellow
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  tipIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCD34D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTextContainer: {
    flex: 1,
  },
  tipHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#78350F', // Brown
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});
