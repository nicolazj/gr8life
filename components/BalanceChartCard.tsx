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
    const counts = Object.values(weeklyCompletion ?? {});
    const n = 8; // Expecting 8 dimensions. Ideally get from config.
    const values = counts.filter(v => typeof v === 'number') as number[];
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

    const sum = dimensionValues.reduce((a, b) => a + b, 0);

    let score = 0;
    if (sum > 0) {
        // Calculate Coefficient of Variation (CV) = Standard Deviation / Mean
        const mean = sum / n;
        const variance = dimensionValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
        const stdDev = Math.sqrt(variance);
        const cv = stdDev / mean;

        // Score = 100 / (1 + CV)
        // If all values are equal, stdDev = 0, CV = 0, Score = 100.
        // If variation is high, CV is high, Score decreases.
        score = Math.round(100 / (1 + cv));
    } else {
        score = 0;
    }

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

    const imbalance = (100 - score) / 100;

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

                    {/* Decorative Svg Line (Graph flourish) */}
                    {/* <View style={styles.flourishContainer}>
                        <Svg width="40" height="20" viewBox="0 0 40 20">
                            <Path
                                d="M0,20 L10,15 L20,18 L30,5 L40,10"
                                fill="none"
                                stroke="#30837D"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            <Circle cx="30" cy="5" r="2" fill="#30837D" />
                            <Circle cx="40" cy="10" r="2" fill="#30837D" />
                        </Svg>
                    </View> */}
                </View>
            </View>

            <View style={styles.statsContainer}>
                <Text style={styles.label}>HOLISTIC BALANCE: <Text style={styles.value}>{score}%</Text></Text>
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
