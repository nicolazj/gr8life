import { IconSymbol } from '@/components/ui/icon-symbol';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EntryDetailScreen() {
    const { id } = useLocalSearchParams<{ id: Id<'entries'> }>();
    const router = useRouter();
    const entry = useQuery(api.entries.getEntry, { entryId: id });
    const deleteEntry = useMutation(api.entries.deleteEntry);

    const handleDelete = () => {
        Alert.alert(
            "Delete Entry",
            "Are you sure you want to delete this check-in?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteEntry({ entryId: id });
                            router.back();
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete entry");
                        }
                    }
                }
            ]
        );
    };

    if (!entry) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <IconSymbol name="xmark" size={24} color="#111827" />
                </TouchableOpacity>
                {/* <Text style={styles.headerTitle}>Details</Text> */}
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Section Header */}
                <View style={styles.sectionHeader}>
                    <IconSymbol name="text.quote" size={24} color="#30837D" style={{ marginRight: 10 }} />
                    <Text style={styles.title}>Notes & Reflection</Text>
                </View>

                {/* Main Content Card */}
                <View style={styles.card}>
                    <Text style={styles.bodyText}>
                        {entry.content}
                    </Text>
                </View>

                {/* Progress Card */}
                <View style={styles.progressCard}>
                    <View style={styles.progressIcon}>
                        <IconSymbol name="chart.bar.fill" size={20} color="#fff" />
                    </View>
                    <View style={styles.progressContent}>
                        <Text style={styles.progressTitle}>gr8Life PROGRESS</Text>
                        <Text style={styles.progressSubtitle}>Contributes +1 to {entry.dimension} consistency.</Text>
                    </View>
                </View>

                {/* Delete Button */}
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <IconSymbol name="trash" size={20} color="#EF4444" style={{ marginRight: 8 }} />
                    <Text style={styles.deleteText}>Delete Entry</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6', // Light gray bg for modal feel
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
    },
    closeButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '800', // Heavy font as per image
        color: '#111827',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    bodyText: {
        fontSize: 16,
        lineHeight: 26, // Good readability
        color: '#374151',
    },
    progressCard: {
        backgroundColor: '#E6F0EE', // Very light teal/gray
        borderRadius: 20, // Pill shape
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    progressIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#5D9C96', // Muted teal
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    progressContent: {
        flex: 1,
    },
    progressTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#30837D',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    progressSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    deleteButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FEF2F2', // Light red
        borderWidth: 1,
        borderColor: '#FEE2E2',
        borderRadius: 16,
        paddingVertical: 16,
    },
    deleteText: {
        color: '#EF4444',
        fontWeight: '700',
        fontSize: 16,
    },
});
