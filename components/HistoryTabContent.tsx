import { landingStyles as styles } from '@/components/landing.styles';

import { EmptyState } from '@/components/EmptyState';
import { TodoCard } from '@/components/TodoCard/TodoCard';
import { FlashList } from '@shopify/flash-list';
import { Text, View } from 'react-native';

interface HistoryTabContentProps {
  todos: any[];
  onToggle: (id: string) => void;
  onEdit: (todo: any) => void;
  onDelete: (id: string) => void;
}

export function HistoryTabContent({
  todos,
  onToggle,
  onEdit,
  onDelete,
}: HistoryTabContentProps) {
  return (
    <View style={styles.historyContainer}>
      <View style={styles.historyHeaderRow}>
        <Text style={styles.historyTitle}>Voice History & Alarms</Text>
        <Text style={styles.historySubtitle}>
          {todos.length} {todos.length === 1 ? 'Task' : 'Tasks'}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <FlashList
          data={todos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<EmptyState />}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TodoCard
              todo={item}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          )}
        />
      </View>
    </View>
  );
}
