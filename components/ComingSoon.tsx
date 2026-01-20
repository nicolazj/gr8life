import { Colors } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface ComingSoonProps {
    title?: string;
    description: string;
    onNotify?: () => void;
    onBack?: () => void;
}

export function ComingSoon({
    title = 'Coming Soon',
    description,
    onNotify = () => console.log('Notify me pressed'),
    onBack,
}: ComingSoonProps) {
    const navigation = useNavigation();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    return (
        <View style={[styles.container]}>
            {/* <View style={styles.header}>
                <TouchableOpacity
                    onPress={handleBack}
                    style={[styles.backButton, { backgroundColor: '#FFF' }]}
                >
                    <IconSymbol name="chevron.left" size={24} color={Colors.text} />
                </TouchableOpacity>
            </View> */}

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.iconContainer}>
                    <View style={[styles.iconCircle, { backgroundColor: Colors.background }]}>
                        <MaterialCommunityIcons name="flower-tulip" size={64} color="#2D8C7F" />
                    </View>
                </View>

                <Text style={[styles.title, { color: Colors.text }]}>{title}</Text>

                <Text style={[styles.description, { color: Colors.icon }]}>
                    {description}
                </Text>

                {/* <TouchableOpacity
                    style={[styles.notifyButton, { backgroundColor: '#2D8C7F' }]}
                    onPress={onNotify}
                >
                    <Text style={styles.notifyButtonText}>Notify Me</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleBack} style={styles.goBackContainer}>
                    <Text style={[styles.goBackText, { color: Colors.icon }]}>Go Back</Text>
                </TouchableOpacity> */}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        alignItems: 'flex-start',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    content: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingBottom: 60,
    },
    iconContainer: {
        marginBottom: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    notifyButton: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: '#2D8C7F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    notifyButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    goBackContainer: {
        padding: 10,
    },
    goBackText: {
        fontSize: 14,
    },
});
