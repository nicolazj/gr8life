import { IconSymbol } from '@/components/ui/icon-symbol';
import { useUser } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PersonalInfoScreen() {
    const router = useRouter();
    const { user } = useUser();
    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [isSaving, setIsSaving] = useState(false);

    const handlePickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
                base64: true,
            });

            if (!result.canceled && result.assets[0].base64) {
                await user?.setProfileImage({
                    file: `data:image/jpeg;base64,${result.assets[0].base64}`,
                });
                Alert.alert('Success', 'Profile photo updated');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update photo');
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await user.update({
                firstName,
                lastName,
            });
            Alert.alert('Success', 'Profile updated successfully');
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.errors?.[0]?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Personal Information</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>

                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            {user?.imageUrl ? (
                                <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                    <IconSymbol size={40} name="person.fill" color="#fff" />
                                </View>
                            )}
                            <TouchableOpacity style={styles.cameraButton} onPress={handlePickImage} activeOpacity={0.8}>
                                <IconSymbol name="camera.fill" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={handlePickImage}>
                            <Text style={styles.changePhotoText}>CHANGE PHOTO</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>FIRST NAME</Text>
                        <TextInput
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder="First Name"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>LAST NAME</Text>
                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Last Name"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>EMAIL ADDRESS</Text>
                        <View style={styles.disabledInputContainer}>
                            <Text style={styles.disabledInputText}>
                                {user?.primaryEmailAddress?.emailAddress || ''}
                            </Text>
                        </View>
                        <Text style={styles.helperText}>EMAIL CANNOT BE CHANGED MANUALLY</Text>
                    </View>

                    {/* Action Buttons */}
                    <TouchableOpacity
                        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => router.back()}
                        disabled={isSaving}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>81-FRAMEWORK</Text>
                        <Text style={styles.footerSubtext}>IDENTITY CONFIGURATION</Text>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    content: {
        padding: 24,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E0E0E0',
    },
    avatarPlaceholder: {
        backgroundColor: '#30837D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#30837D',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    changePhotoText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#30837D',
        letterSpacing: 1,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
        marginBottom: 8,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#111827',
    },
    disabledInputContainer: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    disabledInputText: {
        fontSize: 16,
        color: '#9CA3AF',
    },
    helperText: {
        fontSize: 11,
        color: '#D1D5DB',
        marginTop: 6,
        fontStyle: 'italic',
    },
    saveButton: {
        backgroundColor: '#30837D',
        borderRadius: 24, // Pill shape
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 16,
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    cancelButtonText: {
        color: '#9CA3AF', // Gray cancel text
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
        marginTop: 40,
    },
    footerText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 2,
        marginBottom: 4,
    },
    footerSubtext: {
        fontSize: 10,
        color: '#E5E7EB',
        fontStyle: 'italic',
        letterSpacing: 0.5,
    },
});
