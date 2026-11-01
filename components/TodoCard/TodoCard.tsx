import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { todoCardStyles as styles } from './TodoCard.styles';

export interface TodoCardItemProps {
  todo: {
    id: string;
    title: string;
    urduTitle: string;
    dueDate: string | null;
    category: string;
    hasAlarm: boolean;
    isCompleted: boolean;
  };
  onToggle: (id: string) => void;
  onEdit: (todo: any) => void;
  onDelete: (id: string) => void;
}

export const TodoCard = observer(function TodoCard({
  todo,
  onToggle,
  onEdit,
  onDelete,
}: TodoCardItemProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  // Ponytail: Guard if node is removed or unmounted
  if (!todo || !todo.id) return null;

  const formatTime = (isoString: string | null) => {
    if (!isoString) return 'No alarm';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return isoString;
    }
  };

  const handleEditPress = () => {
    setMenuVisible(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEdit(todo);
  };

  const handleDeletePress = () => {
    setMenuVisible(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete(todo.id);
  };

  return (
    <View style={[styles.card, todo.isCompleted && styles.completedCard]}>
      {/* Checkbox */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onToggle(todo.id);
        }}
        style={styles.checkboxWrapper}
      >
        <Ionicons
          name={todo.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={todo.isCompleted ? '#284F41' : '#7D9289'}
        />
      </Pressable>

      {/* Main Details */}
      <View style={styles.textContainer}>
        <Text style={[styles.title, todo.isCompleted && styles.completedText]}>
          {todo.title}
        </Text>
        {todo.urduTitle ? (
          <Text style={styles.urduText} numberOfLines={1}>
            "{todo.urduTitle}"
          </Text>
        ) : null}

        <View style={styles.badgeRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{todo.category?.toUpperCase() || 'GENERAL'}</Text>
          </View>

          {todo.dueDate && (
            <View style={styles.alarmBadge}>
              <Ionicons name="alarm-outline" size={12} color="#E64A19" />
              <Text style={styles.alarmText}>{formatTime(todo.dueDate)}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Ellipsis Button */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setMenuVisible(true);
        }}
        style={({ pressed }) => [styles.menuBtn, pressed && styles.pressed]}
        hitSlop={8}
      >
        <Ionicons name="ellipsis-vertical" size={18} color="#455B53" />
      </Pressable>

      {/* Action Sheet Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setMenuVisible(false)}>
          <View style={styles.actionSheet}>
            <Text style={styles.sheetHeader}>Task Actions</Text>

            <Pressable onPress={handleEditPress} style={styles.actionOption}>
              <View style={styles.iconCircle}>
                <Ionicons name="pencil-outline" size={18} color="#2A4B40" />
              </View>
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionOptionText}>Edit Task Details</Text>
                <Text style={styles.actionOptionSub}>Change title, category or time</Text>
              </View>
            </Pressable>

            <Pressable onPress={handleDeletePress} style={[styles.actionOption, styles.deleteOption]}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="trash-outline" size={18} color="#DC2626" />
              </View>
              <View style={styles.actionTextWrap}>
                <Text style={[styles.actionOptionText, { color: '#DC2626' }]}>Delete Reminder</Text>
                <Text style={styles.actionOptionSub}>Cancel alarm and remove task</Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
});