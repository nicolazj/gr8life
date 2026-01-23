import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SetupScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();

  const primaryColor = '#30837D';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol size={24} name="chevron.left" color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={{ opacity: 0 }}>
          <IconSymbol size={24} name="ellipsis" color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <IconSymbol size={40} name="person.fill" color="#fff" />
              </View>
            )}

          </View>

          <Text style={styles.userName}>{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : ''}</Text>
          <Text style={styles.userEmail}>{user?.primaryEmailAddress?.emailAddress || ''}</Text>

          {/* <View style={styles.badge}>
            <Text style={styles.badgeText}>PIONEER MEMBER</Text>
          </View> */}
        </View>



        <View style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={() => router.push('/personal-info')}>
            <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
              <IconSymbol size={20} name="person.fill" color="#1E88E5" />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Personal Information</Text>
              <Text style={styles.rowSubtitle}>names and avatar</Text>
            </View>
            <IconSymbol size={20} name="chevron.right" color="#ccc" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row} onPress={() => router.push('/notification-preferences')}>
            <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
              <IconSymbol size={20} name="bell.fill" color="#F57C00" />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Notification Preferences</Text>
              <Text style={styles.rowSubtitle}>when and how you get notified</Text>
            </View>
            <IconSymbol size={20} name="chevron.right" color="#ccc" />
          </TouchableOpacity>

          {/* <View style={styles.divider} /> */}

          {/* <TouchableOpacity style={styles.row}>
            <View style={[styles.iconCircle, { backgroundColor: '#EDE7F6' }]}>
              <IconSymbol size={20} name="moon.fill" color="#5E35B1" />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>App Appearance</Text>
              <Text style={styles.rowSubtitle}>System preference</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>SYSTEM</Text>
              <IconSymbol size={20} name="chevron.right" color="#ccc" />
            </View>
          </TouchableOpacity> */}
        </View>

        {/* Self Improvement Section */}
        {/* <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>SELF-IMPROVEMENT</Text>
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={styles.row}>
            <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
              <IconSymbol size={20} name="waveform.path.ecg" color="#1976D2" />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Aspect Tracking Settings</Text>
            </View>
            <IconSymbol size={20} name="chevron.right" color="#ccc" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row}>
            <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
              <IconSymbol size={20} name="shield.fill" color="#43A047" />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowTitle}>Privacy & Security</Text>
            </View>
            <IconSymbol size={20} name="chevron.right" color="#ccc" />
          </TouchableOpacity>
        </View> */}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await signOut();
            router.replace('/login');
          }}
        >
          <IconSymbol size={20} name="rectangle.portrait.and.arrow.right" color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>gr8Life</Text>
          {/* <Text style={styles.versionSubtext}>HOLISTIC OPTIMIZATION ENGINE</Text> */}
          <TouchableOpacity onPress={() => Linking.openURL('https://hellohenrik.com/81-framework')}>
            <Text style={styles.versionSubtext}>Inspired by https://hellohenrik.com/81-framework</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Light grey background
  },
  unauthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  unauthText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20
  },
  signInButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
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
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  avatarContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    backgroundColor: '#30837D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#30837D', // Teal
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#E0F2F1', // Light teal
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#30837D',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9E9E9E',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 24,
    paddingVertical: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowValue: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 72, // Align with text start
    marginRight: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FECACA', // Light red border
    borderRadius: 24,
    paddingVertical: 16,
    gap: 12,
    marginBottom: 32,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444', // Red
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 2,
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 10,
    color: '#D1D5DB', // Very light grey
    fontStyle: 'italic',
    letterSpacing: 1,
  },
});
