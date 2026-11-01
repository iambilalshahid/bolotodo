import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export type TabKey = 'record' | 'history' | 'settings';

interface FloatingBottomBarProps {
  activeTab?: TabKey;
  onTabChange?: (tab: TabKey) => void;
}

// 44px item width + 20px gap = 64px offset per tab
const TAB_INDEX_MAP: Record<TabKey, number> = {
  record: 0,
  history: 1,
  settings: 2,
};

const TAB_STRIDE = 64;

export function FloatingBottomBar({
  activeTab = 'record',
  onTabChange,
}: FloatingBottomBarProps) {
  const activeIndex = TAB_INDEX_MAP[activeTab] ?? 0;
  const translateX = useSharedValue(activeIndex * TAB_STRIDE);

  useEffect(() => {
    translateX.value = withSpring(activeIndex * TAB_STRIDE, {
      damping: 18,
      stiffness: 160,
      mass: 0.8,
    });
  }, [activeIndex, translateX]);

  const pillAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handlePress = (tab: TabKey) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabChange?.(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pillContainer}>
        {/* Sliding background pill indicator that smoothly travels left/right */}
        <Animated.View style={[styles.slidingPill, pillAnimatedStyle]} />

        {/* Tab 1: Record */}
        <Pressable
          onPress={() => handlePress('record')}
          style={({ pressed }) => [styles.tabItem, pressed && styles.pressed]}
          accessibilityRole="tab"
          accessibilityLabel="Record tab"
        >
          <View
            style={[
              styles.recordOuterCircle,
              { borderColor: activeTab === 'record' ? '#FFFFFF' : '#2A4B40' },
            ]}
          >
            <View
              style={[
                styles.recordInnerDot,
                { backgroundColor: activeTab === 'record' ? '#FFFFFF' : '#2A4B40' },
              ]}
            />
          </View>
        </Pressable>

        {/* Tab 2: History */}
        <Pressable
          onPress={() => handlePress('history')}
          style={({ pressed }) => [styles.tabItem, pressed && styles.pressed]}
          accessibilityRole="tab"
          accessibilityLabel="History tab"
        >
          <Ionicons
            name={activeTab === 'history' ? 'time' : 'time-outline'}
            size={22}
            color={activeTab === 'history' ? '#FFFFFF' : '#2A4B40'}
          />
        </Pressable>

        {/* Tab 3: Settings */}
        <Pressable
          onPress={() => handlePress('settings')}
          style={({ pressed }) => [styles.tabItem, pressed && styles.pressed]}
          accessibilityRole="tab"
          accessibilityLabel="Settings tab"
        >
          <Ionicons
            name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
            size={21}
            color={activeTab === 'settings' ? '#FFFFFF' : '#2A4B40'}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 16,
  },
  pillContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 6,
  },
  slidingPill: {
    position: 'absolute',
    left: 16,
    top: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E362C',
    zIndex: 0,
  },
  tabItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  recordOuterCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.94 }],
  },
});