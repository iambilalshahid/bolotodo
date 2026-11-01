import { formatPersonalGreeting } from '@/utils/greeting';
import { StyleSheet, Text, View } from 'react-native';

export function GreetingHeader() {
  const { salutation, name } = formatPersonalGreeting();

  return (
    <View style={styles.container}>
      <Text style={styles.salutation}>{salutation}</Text>
      <Text style={styles.name}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  salutation: {
    fontSize: 15,
    color: '#496157',
    fontWeight: '500',
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#15241F',
    letterSpacing: -0.5,
  },
});