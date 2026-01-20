import { IconSymbol } from '@/components/ui/icon-symbol';
import { DIMENSION_CONFIG } from '@/convex/schema';
import { useAppStore } from '@/store/appStore';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Easing,
    interpolate,
    runOnJS,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.8;
const RADIUS = CIRCLE_SIZE / 2;
const ICON_SIZE = 40; // Size of the icon
// Adjust radius to place icons inside the circle border. 
// Center of circle is (RADIUS, RADIUS). 
// Distance from center to icon center should be less than RADIUS.
const ICON_RADIUS = RADIUS - 24;

const slides = [
    {
        id: '1',
        title: 'Master Your Holistic Life',
        description:
            'Balance the 8 key pillars of your existence to achieve lasting fulfillment and radical clarity.',
    },
    {
        id: '2',
        title: 'Track Your Progress',
        description:
            'Visualize your growth with intuitive charts and daily check-ins designed for consistency.',
    },
    {
        id: '3',
        title: 'Achieve Balance',
        description:
            'Discover where you thrive and where you need focus to build a truly integrated life.',
    },
];

// ... inside OnboardingScreen ...

// Pulsing animation
// We can use a component to encapsulate each ring's animation
const PulsatingCircle = ({ delay, scaleMax }: { delay: number, scaleMax: number }) => {
    const ringScale = useSharedValue(0.8);
    const ringOpacity = useSharedValue(0.5);

    React.useEffect(() => {
        // Need to wrap in timeout or run properly to stagger if needed, 
        // but withRepeat/delay modifier is better.
        // Let's use simple loop with delay.

        // Reanimated doesn't have a simple "delay start" for the entire loop unless we structure it carefully.
        // Easier: just start scaling.
        ringScale.value = withDelay(delay, withRepeat(
            withTiming(scaleMax, { duration: 3000, easing: Easing.out(Easing.ease) }),
            -1, // Infinite
            false // Do not reverse
        ));

        ringOpacity.value = withDelay(delay, withRepeat(
            withSequence(
                withTiming(0, { duration: 3000 }) // Fade out as it expands
            ),
            -1
        ));
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: ringScale.value }],
            opacity: ringOpacity.value,
        };
    });

    return <Animated.View style={[styles.pulsingRing, animatedStyle]} />;
};

export default function OnboardingScreen() {
    const router = useRouter();
    const { setHasFinishedOnboarding } = useAppStore();
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const scrollRef = useRef<Animated.ScrollView>(null);
    const scrollX = useSharedValue(0);

    const handleNext = () => {
        if (currentSlideIndex < slides.length - 1) {
            scrollRef.current?.scrollTo({
                x: width * (currentSlideIndex + 1),
                animated: true,
            });
        } else {
            completeOnboarding();
        }
    };

    const completeOnboarding = () => {
        setHasFinishedOnboarding(true);
        router.replace('/');
    };

    const onScrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
        onMomentumEnd: (event) => {
            const index = Math.round(event.contentOffset.x / width);
            runOnJS(setCurrentSlideIndex)(index);
        },
    });

    const animatedCircleStyle = useAnimatedStyle(() => {
        // Rotate the circle based on scroll position
        // Full scroll width is width * (slides.length - 1)
        // Let's rotate 120 degrees per slide roughly, or just fit 360 over the whole thing?
        // Let's do 90 degrees per slide swipe to keep it dynamic.
        const rotation = interpolate(
            scrollX.value,
            [0, width * (slides.length - 1)],
            [0, 360 / slides.length * (slides.length - 1)] // Rotate partial circle
        );
        // OR simply linear rotation: 1 pixel = x degrees. 
        // Let's make it rotate 45 degrees (1/8 of circle) per slide? 
        // We have 8 dimensions. Maybe rotate so a new one is at the top?
        // Local index logic: 360 / 8 = 45 deg per icon.
        // Let's rotate significantly to show movement.
        const rotateDeg = interpolate(scrollX.value, [0, width], [0, 90]);
        return {
            transform: [{ rotate: `${rotateDeg}deg` }],
        };
    });

    const animatedIconStyle = useAnimatedStyle(() => {
        // Counter-rotate to keep icons upright
        const rotateDeg = interpolate(scrollX.value, [0, width], [0, 90]);
        return {
            transform: [{ rotate: `-${rotateDeg}deg` }],
        };
    });

    // Get dimensions array
    const dimensions = Object.values(DIMENSION_CONFIG);



    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Gr8Life</Text>
                <TouchableOpacity onPress={completeOnboarding}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                {/* Circle Graphic */}
                <View style={styles.imageContainer}>
                    {/* Pulsating Circles Background */}
                    <View style={StyleSheet.absoluteFill}>
                        <View style={styles.centeredContent}>
                            <PulsatingCircle delay={0} scaleMax={1.5} />
                            <PulsatingCircle delay={1000} scaleMax={1.5} />
                            <PulsatingCircle delay={2000} scaleMax={2} />
                        </View>
                    </View>

                    <View style={styles.circleOuter} />
                    <View style={styles.circleInner} />

                    {/* Central Image */}
                    <Image source={require('../assets/images/wave.png')} style={styles.image} resizeMode="contain" />

                    {/* Rotating wrapper for icons */}
                    <Animated.View style={[styles.rotatingContainer, animatedCircleStyle]}>
                        {dimensions.map((dim, index) => {
                            const angle = (index * 360) / dimensions.length; // Degrees
                            const angleRad = (angle * Math.PI) / 180; // Radians

                            // Position calculation:
                            // Center is (RADIUS, RADIUS)
                            // x = center + r * cos(theta)
                            // y = center + r * sin(theta)
                            // Adjust for icon center (subtract half size)
                            const x = RADIUS + ICON_RADIUS * Math.cos(angleRad) - ICON_SIZE / 2;
                            const y = RADIUS + ICON_RADIUS * Math.sin(angleRad) - ICON_SIZE / 2;

                            return (
                                <Animated.View
                                    key={dim.name}
                                    style={[
                                        styles.iconWrapper,
                                        {
                                            left: x,
                                            top: y,
                                            backgroundColor: dim.color + '20',
                                        },
                                        animatedIconStyle
                                    ]}
                                >
                                    <IconSymbol name={dim.icon} size={20} color={dim.color} />
                                </Animated.View>
                            );
                        })}
                    </Animated.View>
                </View>

                {/* Carousel */}
                <Animated.ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={onScrollHandler}
                    scrollEventThrottle={16}
                    contentContainerStyle={styles.scrollContent}
                >
                    {slides.map((slide) => (
                        <View key={slide.id} style={styles.slide}>
                            <Text style={styles.title}>{slide.title}</Text>
                            <Text style={styles.description}>{slide.description}</Text>
                        </View>
                    ))}
                </Animated.ScrollView>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                {/* Indicators */}
                <View style={styles.indicatorContainer}>
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                currentSlideIndex === index && styles.indicatorActive,
                            ]}
                        />
                    ))}
                </View>

                {/* Button */}
                <Pressable style={styles.button} onPress={handleNext} hitSlop={16}>
                    <Text style={styles.buttonText}>
                        {currentSlideIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    skipText: {
        fontSize: 16,
        color: '#30837D',
        fontWeight: '600',
    },
    contentContainer: {
        marginTop: 20,
    },
    scrollContent: {
        alignItems: 'flex-start', // Important for horizontal paging
    },
    slide: {
        width: width,
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 20,
    },
    imageContainer: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        alignSelf: 'center', // Center in parent
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    circleOuter: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        opacity: 0.8,
    },
    circleInner: {
        position: 'absolute',
        width: '70%',
        height: '70%',
        borderRadius: 999,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        opacity: 0.6,
    },
    rotatingContainer: {
        position: 'absolute',
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE, // Explicit size
        top: 0,
        left: 0,
        zIndex: 10,
        pointerEvents: 'none', // Allow clicks validly pass through if needed, though icons usually don't need interaction here
    },
    iconWrapper: {
        position: 'absolute',
        width: ICON_SIZE,
        height: ICON_SIZE,
        borderRadius: ICON_SIZE / 2,
        justifyContent: 'center',
        alignItems: 'center',
        // Shadow for better visibility
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        backgroundColor: 'white',
    },
    // ...
    pulsingRing: {
        position: 'absolute',
        width: CIRCLE_SIZE * 0.5, // Start smaller or match image size? Let's say based on image size. Image is 40% (0.4). 
        // Let's make ring start around that size.
        // CIRCLE_SIZE is wrapper. Image is 40% of CIRCLE_SIZE.
        height: CIRCLE_SIZE * 0.5,
        borderRadius: 999,
        backgroundColor: '#30837D', // Teal
        opacity: 0.3,
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        // ...
        width: '40%',
        height: '40%',
        borderRadius: 999,
        opacity: 0.9,
        shadowColor: '#30837D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 36,
    },
    description: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 16,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 32,
        paddingBottom: 48,
        alignItems: 'center',
    },
    indicatorContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 32,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D1D5DB',
    },
    indicatorActive: {
        backgroundColor: '#30837D',
        width: 24,
    },
    button: {
        backgroundColor: '#30837D',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: '#30837D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
