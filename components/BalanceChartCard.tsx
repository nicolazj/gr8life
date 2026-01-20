import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

export function BalanceChartCard() {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Monday
    const startTimestamp = startOfWeek.getTime();

    const weeklyCompletion = useQuery(api.entries.weeklyCompletion, { startTimestamp });

    // Extract counts from the data
    // Fill missing dimensions with 0 if necessary, though the API currently returns a map.
    // The current API (entries.ts) was updated to return a Record<string, number>.
    // Let's ensure we have 8 values.
    const dimensionValues: number[] = [];
    if (weeklyCompletion) {
        // Just take the values from the map
        Object.values(weeklyCompletion).forEach(v => {
            if (typeof v === 'number') dimensionValues.push(v);
        });
    }
    // Pad with zeros if less than 8 dimensions found (shouldn't happen with correct API, but safe)
    while (dimensionValues.length < 8) {
        dimensionValues.push(0);
    }


    // New Scoring Logic: 1 point for each dimension > 0
    let fillCount = 0;
    dimensionValues.slice(0, 8).forEach(v => {
        if (v > 0) fillCount++;
    });

    // Score is simply the count out of 8
    const score = fillCount;

    // Animation values
    const pulse1 = useSharedValue(1);
    const pulse2 = useSharedValue(1);

    useEffect(() => {
        pulse1.value = withRepeat(
            withSequence(
                withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
        pulse2.value = withRepeat(
            withSequence(
                withTiming(1.03, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    // Imbalance calculation:
    // If score is 8, imbalance is 0 (concentric).
    // If score is 0, imbalance is 1 (max displacement).
    const imbalance = (8 - score) / 8;

    const style1 = useAnimatedStyle(() => ({
        transform: [
            { scale: pulse1.value },
            { translateX: 25 * imbalance },
            { translateY: -15 * imbalance }
        ]
    }));

    const style2 = useAnimatedStyle(() => ({
        transform: [
            { scale: pulse2.value },
            { translateX: -20 * imbalance },
            { translateY: 25 * imbalance }
        ]
    }));

    return (
        <View style={styles.card}>
            <View style={styles.chartContainer}>
                {/* Visual Representation of Balance */}
                <View style={styles.circlesWrapper}>
                    {/* Outer Light Ring */}
                    <Animated.View style={[styles.circle, styles.circle3, style2]} />
                    {/* Mid Ring */}
                    <Animated.View style={[styles.circle, styles.circle2, style1]} />
                    {/* Inner Core */}
                    <View style={[styles.circle, styles.circle1]} />
                </View>
            </View>

            <View style={styles.statsContainer}>
                <Text style={styles.label}>HOLISTIC BALANCE: <Text style={styles.value}>{score}/8</Text></Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 32,
        marginBottom: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 220,
        width: 220,
    },
    circlesWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 200,
    },
    circle: {
        position: 'absolute',
        borderRadius: 999,
    },
    // Inner
    circle1: {
        width: 120,
        height: 120,
        backgroundColor: '#6DAFA7', // Medium Teal
        opacity: 0.9,
    },
    // Mid
    circle2: {
        width: 160,
        height: 160,
        backgroundColor: '#B2DFDB',
        opacity: 0.5,
    },
    // Outer
    circle3: {
        width: 200,
        height: 200,
        backgroundColor: '#E0F2F1',
        opacity: 0.4,
        borderColor: '#B2DFDB',
        borderWidth: 1,
    },
    flourishContainer: {
        position: 'absolute',
        right: -10,
        bottom: 50,
        opacity: 0.8,
    },
    statsContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#8CA3A1',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    value: {
        color: '#30837D', // Primary Color
        fontWeight: '800',
    },
});
