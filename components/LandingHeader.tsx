import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface LandingHeaderProps {
  appName?: string;
  onBackPress?: () => void;
  selectedMic?: string;
}

export function LandingHeader({
  appName = 'Convora',
  onBackPress,
  selectedMic = 'Default mic',
}: LandingHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          onPress={onBackPress}
          style={({ pressed }) => [styles.circleBtn, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={20} color="#333333" />
        </Pressable>

        <View style={styles.brandRow}>
          <Ionicons name="podium-outline" size={20} color="#2A4B40" />
          <Text style={styles.brandText}>{appName}</Text>
        </View>
      </View>

      <View style={styles.micPillWrapper}>
        <View style={styles.micPill}>
          <Ionicons name="sparkles" size={13} color="#55605C" />
          <Text style={styles.micText}>{selectedMic}</Text>
          <Ionicons name="chevron-down" size={13} color="#77807D" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E2C26',
    letterSpacing: -0.3,
  },
  micPillWrapper: {
    alignItems: 'center',
    marginTop: 18,
  },
  micPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  micText: {
    fontSize: 13,
    color: '#3B4743',
    fontWeight: '500',
  },
});