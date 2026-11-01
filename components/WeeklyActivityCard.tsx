import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface ActivityCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}

function StatTile({ icon, value, label }: ActivityCardProps) {
  return (
    <View style={styles.tile}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={16} color="#2A4B40" />
      </View>
      <Text style={styles.valueText}>{value}</Text>
      <Text style={styles.labelText}>{label}</Text>
    </View>
  );
}

export function WeeklyActivityCard({ totalCount = 0 }: { totalCount?: number }) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Ionicons name="sparkles" size={14} color="#355247" />
        <Text style={styles.cardHeader}>Your Weekly Activity</Text>
      </View>

      <View style={styles.tilesRow}>
        <StatTile icon="stats-chart" value={String(totalCount)} label="Recording" />
        <StatTile icon="time-outline" value="0m" label="Recorded" />
        <StatTile icon="document-text-outline" value="0" label="Summaries" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#EAF0EC',
    borderRadius: 24,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  cardHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#28463B',
  },
  tilesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0F4F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  valueText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#152520',
  },
  labelText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#657871',
    marginTop: 2,
  },
});