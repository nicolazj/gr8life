import { useAppStore } from '@/store/appStore';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const slides = [
    {
        id: '1',
        title: 'Master Your Holistic Life',
        description:
            'Balance the 8 key pillars of your existence to achieve lasting fulfillment and radical clarity.',
        image: require('../assets/images/react-logo.png'), // Placeholder or custom asset
    },
    {
        id: '2',
        title: 'Track Your Progress',
        description:
            'Visualize your growth with intuitive charts and daily check-ins designed for consistency.',
        image: require('../assets/images/react-logo.png'), // Placeholder
    },
    {
        id: '3',
        title: 'Achieve Balance',
        description:
            'Discover where you thrive and where you need focus to build a truly integrated life.',
        image: require('../assets/images/react-logo.png'), // Placeholder
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const { setHasFinishedOnboarding } = useAppStore();
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const scrollRef = useRef<ScrollView>(null);

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

    const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setCurrentSlideIndex(currentIndex);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Gr8Life</Text>
                <TouchableOpacity onPress={completeOnboarding}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <View>

                {/* Carousel */}
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={onMomentumScrollEnd}
                    contentContainerStyle={styles.scrollContent}
                >
                    {slides.map((slide) => (
                        <View key={slide.id} style={styles.slide}>
                            {/* Circle Graphic Placeholder - mirroring the design roughly */}
                            <View style={styles.imageContainer}>
                                <View style={styles.circleOuter} />
                                <View style={styles.circleInner} />
                                <Image source={slide.image} style={styles.image} resizeMode="contain" />
                            </View>

                            <Text style={styles.title}>{slide.title}</Text>
                            <Text style={styles.description}>{slide.description}</Text>
                        </View>
                    ))}
                </ScrollView>
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
    scrollContent: {
        alignItems: 'center',
    },
    slide: {
        width: width,
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 40,
    },
    imageContainer: {
        width: width * 0.8,
        height: width * 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 48,
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
    image: {
        width: '50%',
        height: '50%',
        opacity: 0.2, // Placeholder opacity
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
