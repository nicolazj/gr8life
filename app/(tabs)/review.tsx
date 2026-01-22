import { ComingSoon } from '@/components/ComingSoon';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReviewScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ComingSoon
        title="Coming Soon"
        description="We are working hard to bring this feature to gr8Life. Stay tuned for updates as we continue to evolve our tools for holistic self-improvement."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6'
  },
});
