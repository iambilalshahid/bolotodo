import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface EditTodoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  todo: {
    id: string;
    title: string;
    category: string;
    dueDate: string | null;
  } | null;
  onSave: (id: string, title: string, category: string, dueDate: string | null) => void;
}

export function EditTodoDialog({
  open,
  onOpenChange,
  todo,
  onSave,
}: EditTodoDialogProps) {
  const [title, setTitle] = useState(todo?.title || '');
  const [category, setCategory] = useState(todo?.category || 'general');
  const [dueDate, setDueDate] = useState(todo?.dueDate || '');

  React.useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setCategory(todo.category);
      setDueDate(todo.dueDate || '');
    }
  }, [todo]);

  const handleSave = () => {
    if (!todo) return;
    onSave(todo.id, title.trim() || todo.title, category, dueDate.trim() || null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[340px] rounded-2xl bg-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-convora-forest">
            Edit Reminder
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Update your task title, category catalog, and reminder time.
          </DialogDescription>
        </DialogHeader>

        <View style={styles.formContainer}>
          <Text style={styles.fieldLabel}>Task Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Gym jana hai"
            placeholderTextColor="#8C9A95"
          />

          <Text style={styles.fieldLabel}>Category Catalog</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="fitness, work, personal, health"
            placeholderTextColor="#8C9A95"
          />

          <Text style={styles.fieldLabel}>Due Date / Alarm Time (ISO)</Text>
          <TextInput
            style={styles.input}
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="YYYY-MM-DDTHH:mm:ss"
            placeholderTextColor="#8C9A95"
          />
        </View>

        <DialogFooter className="flex-row gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onPress={() => onOpenChange(false)}
          >
            <Text>Cancel</Text>
          </Button>
          <Button
            className="flex-1 rounded-xl bg-convora-forest"
            onPress={handleSave}
          >
            <Text className="text-white">Save Changes</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    gap: 10,
    marginVertical: 10,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#28463B',
  },
  input: {
    backgroundColor: '#F3F6F4',
    borderWidth: 1,
    borderColor: '#DDE5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#152520',
  },
});