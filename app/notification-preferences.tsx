
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useNotificationStore } from '@/store/notificationStore';
import { cancelReminders, scheduleReminder } from '@/utils/notifications';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationPreferencesScreen() {
    const router = useRouter();

    // Store
    const {
        reminderTime,
        reminderDays,
        setReminderTime,
        toggleReminderDay,
    } = useNotificationStore();

    const [showTimePicker, setShowTimePicker] = useState(false);

    const primaryColor = '#30837D';

    const onTimeChange = (event: any, selectedDate?: Date) => {
        // If user cancels (on Android), selectedDate might be undefined
        if (selectedDate) {
            setReminderTime(selectedDate.toISOString());
        }

        if (Platform.OS === 'android') {
            setShowTimePicker(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const reminderDateObj = new Date(reminderTime);

    const handleSave = async () => {
        try {
            // Logic: if any day is selected, schedule reminders. If empty, cancel.
            if (reminderDays.length > 0) {
                const timeToSchedule = new Date(reminderTime);
                await scheduleReminder(timeToSchedule, reminderDays);
            } else {
                await cancelReminders();
            }
        } catch (error) {
            console.error("Failed to schedule notification:", error);
        } finally {
            router.back();
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol size={24} name="chevron.left" color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notification Preferences</Text>
                <TouchableOpacity>
                    <IconSymbol size={20} name="questionmark.circle" color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <Text style={styles.sectionTitle}>SCHEDULE CONFIGURATION</Text>
                <View style={styles.card}>
                    <Text style={styles.cardDescription}>
                        Select the days you want to receive check-in reminders.
                        Reminders are automatically enabled when at least one day is selected.
                    </Text>

                    <Text style={styles.daySelectorLabel}>Select Days</Text>
                    <View style={styles.daySelector}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
                            const isSelected = reminderDays.includes(index);
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.dayBubble,
                                        isSelected && styles.dayBubbleActive,
                                    ]}
                                    onPress={() => toggleReminderDay(index)}
                                >
                                    <Text
                                        style={[
                                            styles.dayText,
                                            isSelected && styles.dayTextActive,
                                        ]}
                                    >
                                        {day}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.pickerRow}>
                        <View style={styles.pickerLabelContainer}>
                            <View style={[styles.iconSmall, { backgroundColor: '#FFF7ED' }]}>
                                <IconSymbol name="clock.fill" size={18} color="#F97316" />
                            </View>
                            <Text style={styles.pickerLabel}>Reminder Time</Text>
                        </View>

                        {/* On iOS, DateTimePicker can be displayed inline or compact. logic varies by OS */}
                        {Platform.OS === 'ios' ? (
                            <RNDateTimePicker
                                value={reminderDateObj}
                                mode="time"
                                minuteInterval={15}
                                display="compact"
                                onChange={onTimeChange}
                                themeVariant="light"
                                accentColor={primaryColor}
                            />
                        ) : (
                            <TouchableOpacity style={styles.timeButton} onPress={() => setShowTimePicker(true)}>
                                <Text style={styles.timeButtonText}>{formatTime(reminderTime)}</Text>
                            </TouchableOpacity>
                        )}
                        {showTimePicker && Platform.OS === 'android' && (
                            <RNDateTimePicker
                                value={reminderDateObj}
                                mode="time"
                                display="default"
                                onChange={onTimeChange}
                            />
                        )}
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save Preferences</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
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
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
        marginBottom: 8,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginLeft: 4,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContent: {
        gap: 2,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    itemSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    cardDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
        lineHeight: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 16,
        marginBottom: 16
    },
    daySelectorLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginLeft: 0,
        marginBottom: 12,
    },
    daySelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 8,
    },
    dayBubble: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayBubbleActive: {
        backgroundColor: '#30837D',
    },
    dayText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    dayTextActive: {
        color: '#FFF',
    },
    pickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pickerLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconSmall: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pickerLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    timeButton: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    timeButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        marginTop: 24,
        paddingBottom: Platform.OS === 'ios' ? 0 : 20,
    },
    saveButton: {
        backgroundColor: '#30837D',
        paddingVertical: 16,
        borderRadius: 24,
        alignItems: 'center',
        shadowColor: '#30837D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
