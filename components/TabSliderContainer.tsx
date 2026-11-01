import type { TabKey } from '@/components/FloatingBottomBar';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface TabSliderContainerProps {
  activeTab: TabKey;
  children: [React.ReactNode, React.ReactNode, React.ReactNode];
}

const TAB_INDEX_MAP: Record<TabKey, number> = {
  record: 0,
  history: 1,
  settings: 2,
};

export function TabSliderContainer({ activeTab, children }: TabSliderContainerProps) {
  const { width } = useWindowDimensions();
  const activeIndex = TAB_INDEX_MAP[activeTab] ?? 0;
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    translateX.value = withSpring(-activeIndex * width, {
      damping: 22,
      stiffness: 170,
      mass: 0.85,
    });
  }, [activeIndex, width, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.viewport}>
      <Animated.View style={[styles.sliderTrack, { width: width * 3 }, animatedStyle]}>
        {children.map((child, idx) => (
          <View key={idx} style={[styles.slidePane, { width }]}>
            {child}
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    flex: 1,
    overflow: 'hidden',
    width: '100%',
  },
  sliderTrack: {
    flex: 1,
    flexDirection: 'row',
  },
  slidePane: {
    flex: 1,
    height: '100%',
  },
});
