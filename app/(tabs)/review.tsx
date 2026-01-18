import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ReviewScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <IconSymbol size={32} name="chart.bar.fill" />
            <Text >Review</Text>
          </View>
          <View style={styles.placeholder}>
            <Text >Coming Soon</Text>
            <Text style={styles.subtitle}>
              Review your weekly progress and analyze your life balance.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  subtitle: {
    marginTop: 12,
    opacity: 0.6,
    fontSize: 14,
    textAlign: 'center',
  },
});
