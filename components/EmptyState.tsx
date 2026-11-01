import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export function EmptyState() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="mic-outline" size={36} color="#355A4C" />
      </View>
      <Text style={styles.title}>No Reminders Yet</Text>
      <Text style={styles.subtitle}>
        Bolo jaise: "Mujhe kal subha 9 baje gym jana hai" aur Convora auto reminder set karega.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E6ECE8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#152520',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#556E63',
    textAlign: 'center',
    lineHeight: 19,
  },
});