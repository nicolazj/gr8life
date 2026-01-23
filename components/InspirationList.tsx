import { type Dimension } from '@/convex/schema';
import { useAppStore } from '@/store/appStore';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

const InspirationSchema = z.object({
    inspiration: z.object({
        title: z.string(),
        description: z.string(),
    })
});

export function InspirationList({ dimension, color }: { dimension: Dimension, color: string }) {
    const { inspirations, } = useAppStore();
    const currentInspirations = inspirations[dimension] || [];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Inspirations</Text>
                {/* <TouchableOpacity
                    onPress={handleRegenerate}
                    disabled={loading}
                    style={styles.regenerateButton}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#30837D" />
                    ) : (
                        <>
                            <IconSymbol name="sparkles" size={16} color="#30837D" />
                            <Text style={styles.regenerateText}>Regenerate</Text>
                        </>
                    )}
                </TouchableOpacity> */}
            </View>

            {currentInspirations.map((inspiration: any, index: number) => (
                <View key={index} style={styles.inspirationCard}>
                    <View style={[styles.iconContainer, { backgroundColor: (color) + '20' }]}>
                    </View>
                    <View style={styles.content}>
                        <Text style={styles.cardTitle}>{inspiration.title}</Text>
                        <Text style={styles.cardDesc}>{inspiration.description}</Text>
                    </View>
                    {/* <IconSymbol name="arrow.right" size={20} color={color} /> */}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    regenerateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 8,
        backgroundColor: '#E0F2F1',
        borderRadius: 12,
    },
    regenerateText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#30837D',
    },
    inspirationCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
    },
    cardDesc: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
});
