import { InspirationList } from '@/components/InspirationList';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { api } from '@/convex/_generated/api';
import { DIMENSION_CONFIG, type Dimension } from '@/convex/schema';
import { useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DimensionDashboardScreen() {
    const { dimension } = useLocalSearchParams<{ dimension?: Dimension }>();
    const router = useRouter();
    const config = dimension ? DIMENSION_CONFIG[dimension] : null;
    const entries = useQuery(api.entries.entriesByDimension, { dimension: dimension || '' });

    const [activeTab, setActiveTab] = React.useState<'ideas' | 'interactions'>('interactions');

    const dimensionIndex = Object.keys(DIMENSION_CONFIG).indexOf(dimension || '') + 1;
    const formattedIndex = dimensionIndex.toString().padStart(2, '0');

    if (!config) return null;


    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === date.toDateString();

        if (isToday) return 'TODAY';
        if (isYesterday) return 'YESTERDAY';
        return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    };

    // Helper to format detailed time/date
    const formatTimeDetail = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <>


            <SafeAreaView style={styles.container} edges={['top']}>
                {/* Custom Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <IconSymbol name="chevron.left" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{config.name}</Text>
                    <TouchableOpacity onPress={() => { }} style={{ opacity: 0 }}>
                        <IconSymbol name="ellipsis" size={24} color="#000" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Hero Card */}
                    <LinearGradient
                        colors={[config.color + '30', config.color + '10']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.heroCard}
                    >
                        <View style={[styles.aspectBadge, { backgroundColor: config.color + '15' }]}>
                            <Text style={[styles.aspectText, { color: config.color }]}>ASPECT {formattedIndex}</Text>
                        </View>
                        <Text style={styles.heroTitle}>{config.name}</Text>
                        <Text style={styles.heroSubtitle}>{config.description}</Text>
                    </LinearGradient>

                    {/* Tabs */}
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'interactions' && styles.activeTab]}
                            onPress={() => setActiveTab('interactions')}
                        >
                            <Text style={[styles.tabText, activeTab === 'interactions' && styles.activeTabText]}>Check-ins</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'ideas' && styles.activeTab]}
                            onPress={() => setActiveTab('ideas')}
                        >
                            <Text style={[styles.tabText, activeTab === 'ideas' && styles.activeTabText]}>Inspiration</Text>
                        </TouchableOpacity>
                    </View>

                    {activeTab === 'interactions' && (
                        <>


                            {/* Recent Interactions */}
                            <View style={styles.sectionContainer}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.recentTitle}>Recent Check-ins</Text>
                                    <TouchableOpacity
                                        style={styles.addButton}
                                        onPress={() => router.push(`/dimension/${dimension}/check-in`)}
                                    >
                                        <IconSymbol name="plus" size={20} color="#fff" />
                                    </TouchableOpacity>
                                </View>

                                {entries === undefined ? (
                                    <View style={styles.emptyState}>
                                        <Text style={styles.emptyText}>Loading...</Text>
                                    </View>
                                ) : entries && entries.length > 0 ? (
                                    entries.map((entry) => (
                                        <TouchableOpacity
                                            key={entry._id}
                                            style={styles.interactionCard}
                                            onPress={() => router.push(`/entry/${entry._id}`)}
                                        >
                                            <View style={[styles.interactionIcon, { backgroundColor: config.color + '20' }]}>
                                                <IconSymbol name={config.icon} size={24} color={config.color} />
                                            </View>
                                            <View style={styles.interactionContent}>
                                                <Text style={styles.interactionText} numberOfLines={1}>{entry.content}</Text>
                                                <Text style={styles.interactionSubtext}>
                                                    {formatTimeDetail(entry.createdAt)} • {config.name}
                                                </Text>
                                            </View>
                                            <Text style={styles.interactionDate}>{formatDate(entry.createdAt)}</Text>
                                        </TouchableOpacity>
                                    ))
                                ) : (
                                    <View style={styles.emptyState}>
                                        <Text style={styles.emptyText}>No interactions recorded yet.</Text>
                                    </View>
                                )}
                            </View>
                        </>
                    )}

                    {/* Health Integration Card */}
                    {/* Health Integration Card */}
                    {activeTab === 'ideas' && (
                        <InspirationList dimension={dimension || 'health'} color={config.color} />
                    )}

                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAF9F6',
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
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 80,
    },
    heroCard: {
        margin: 20,
        borderRadius: 24,
        padding: 24,
        minHeight: 180,
        justifyContent: 'center',
    },
    aspectBadge: {
        backgroundColor: 'rgba(48, 131, 125, 0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 16,
    },
    aspectText: {
        color: '#30837D',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
        letterSpacing: -0.5,
        lineHeight: 34,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        lineHeight: 22,
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#30837D',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    activeTabText: {
        color: '#30837D',
    },
    sectionContainer: {
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    growthCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    growthLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
        letterSpacing: 1,
        marginBottom: 6,
    },
    growthValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#30837D',
    },
    progressBarBg: {
        width: 120,
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#30837D',
        borderRadius: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    seeAllText: {
        fontSize: 14,
        color: '#30837D',
        fontWeight: '600',
    },
    ideasScroll: {
        paddingRight: 20,
        gap: 16,
    },
    ideaCard: {
        width: 200,
        height: 200,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
    },
    ideaImagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ideaOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.3)', // Basic overlay
    },
    ideaTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    ideaRating: {
        color: '#fff',
        fontSize: 12,
        opacity: 0.9,
    },
    recentTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#30837D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    interactionCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
    },
    inspirationCard: {
        backgroundColor: '#fff',
        padding: 20, // Kept padding 20 from healthCard, or could be 16 like interactionCard. Let's stick to 16 to match? But healthCard text might need space. healthCard had 20. let's use 20.
        borderRadius: 24, // healthCard was 24, interactionCard 20. Let's keep 24 as it was.
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
    },
    interactionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    interactionContent: {
        flex: 1,
    },
    interactionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    interactionSubtext: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    interactionDate: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9CA3AF',
        marginLeft: 8,
    },
    emptyState: {
        padding: 24,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
});
