import { useRootStore } from '@/store/RootStore';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { settingsStyles as styles } from './SettingsTab.styles';

interface SettingsTabProps {
  availableInputs?: Array<{ uid: string; name: string }>;
  selectedMic: string;
  onSelectMic: (name: string, uid?: string) => void;
}

export const SettingsTabContent = observer(function SettingsTabContent({ }: SettingsTabProps) {
  const { uiStore } = useRootStore();
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  const currentTheme = uiStore.theme || 'system';

  const handleSelectTheme = (mode: 'light' | 'dark' | 'system') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    uiStore.setTheme(mode);
    setThemeModalVisible(false);
  };

  const themeDisplayTitle =
    currentTheme === 'light'
      ? 'Light Theme'
      : currentTheme === 'dark'
        ? 'Dark Theme'
        : 'System Default';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Appearance / Theme Card */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Ionicons name="color-palette-outline" size={20} color="#2A4B40" />
          <Text style={styles.cardTitle}>Appearance & Theme</Text>
        </View>

        <Pressable
          style={styles.themeSelectorBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setThemeModalVisible(true);
          }}
        >
          <View style={styles.themeSelectorLeft}>
            <Ionicons
              name={
                currentTheme === 'light'
                  ? 'sunny-outline'
                  : currentTheme === 'dark'
                    ? 'moon-outline'
                    : 'phone-portrait-outline'
              }
              size={18}
              color="#284F41"
            />
            <Text style={styles.themeSelectorText}>{themeDisplayTitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#556E63" />
        </Pressable>
      </View>

      {/* System Status Card */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Ionicons name="sparkles-outline" size={20} color="#2A4B40" />
          <Text style={styles.cardTitle}>AI & Speech Engine</Text>
        </View>
        <Text style={styles.subText}>AI Brain: Groq Cloud (openai/gpt-oss-20b)</Text>
        <Text style={styles.subText}>Whisper STT: Whisper Large V3 Turbo</Text>
        <Text style={styles.subText}>Offline STT: Local Whisper.rn fallback</Text>
        <Text style={styles.subText}>Notifications: Android Channel Active</Text>
      </View>

      {/* Theme Selection Modal Action Sheet */}
      <Modal
        visible={themeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setThemeModalVisible(false)}
        >
          <View style={styles.actionSheet}>
            <Text style={styles.sheetHeader}>Choose Theme</Text>

            {/* Light Option */}
            <Pressable
              onPress={() => handleSelectTheme('light')}
              style={[styles.actionOption, currentTheme === 'light' && styles.actionOptionActive]}
            >
              <View
                style={[styles.iconCircle, currentTheme === 'light' && styles.iconCircleActive]}
              >
                <Ionicons
                  name="sunny-outline"
                  size={18}
                  color={currentTheme === 'light' ? '#FFFFFF' : '#2A4B40'}
                />
              </View>
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionOptionText}>Light Theme</Text>
                <Text style={styles.actionOptionSub}>Crisp, clean bright aesthetics</Text>
              </View>
              {currentTheme === 'light' && (
                <Ionicons name="checkmark-circle" size={20} color="#284F41" />
              )}
            </Pressable>

            {/* Dark Option */}
            <Pressable
              onPress={() => handleSelectTheme('dark')}
              style={[styles.actionOption, currentTheme === 'dark' && styles.actionOptionActive]}
            >
              <View
                style={[styles.iconCircle, currentTheme === 'dark' && styles.iconCircleActive]}
              >
                <Ionicons
                  name="moon-outline"
                  size={18}
                  color={currentTheme === 'dark' ? '#FFFFFF' : '#2A4B40'}
                />
              </View>
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionOptionText}>Dark Theme</Text>
                <Text style={styles.actionOptionSub}>Easy on the eyes at night</Text>
              </View>
              {currentTheme === 'dark' && (
                <Ionicons name="checkmark-circle" size={20} color="#284F41" />
              )}
            </Pressable>

            {/* System Default Option */}
            <Pressable
              onPress={() => handleSelectTheme('system')}
              style={[styles.actionOption, currentTheme === 'system' && styles.actionOptionActive]}
            >
              <View
                style={[styles.iconCircle, currentTheme === 'system' && styles.iconCircleActive]}
              >
                <Ionicons
                  name="phone-portrait-outline"
                  size={18}
                  color={currentTheme === 'system' ? '#FFFFFF' : '#2A4B40'}
                />
              </View>
              <View style={styles.actionTextWrap}>
                <Text style={styles.actionOptionText}>System Default</Text>
                <Text style={styles.actionOptionSub}>Match your phone's system settings</Text>
              </View>
              {currentTheme === 'system' && (
                <Ionicons name="checkmark-circle" size={20} color="#284F41" />
              )}
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
});