import { landingStyles as styles } from '@/components/landing.styles';

import { GreetingHeader } from '@/components/GreetingHeader';
import { MicButton } from '@/components/MicButton/MicButton';
import { WeeklyActivityCard } from '@/components/WeeklyActivityCard';
import { View } from 'react-native';

interface RecordTabHomeProps {
  totalCount: number;
  onStartRecording: () => void;
}

export function RecordTabHome({
  totalCount,
  onStartRecording,
}: RecordTabHomeProps) {
  return (
    <View style={styles.idleContent}>
      <GreetingHeader />

      <View style={styles.centerMicSection}>
        <MicButton isRecording={false} onPress={onStartRecording} />
      </View>

      <WeeklyActivityCard totalCount={totalCount} />
    </View>
  );
}