import { EditTodoDialog } from '@/components/EditTodoDialog';
import { FloatingBottomBar, type TabKey } from '@/components/FloatingBottomBar';
import { HistoryTabContent } from '@/components/HistoryTabContent';
import { landingStyles as styles } from '@/components/landing.styles';
import { RecordingControls } from '@/components/MicButton/RecordingControls';
import { Waveform } from '@/components/MicButton/Waveform';
import { RecordTabHome } from '@/components/RecordTabHome';
import { SaveRecordingSheet } from '@/components/SaveRecordingSheet';
import { SettingsTabContent } from '@/components/SettingsTabContent';
import { TabSliderContainer } from '@/components/TabSliderContainer';
import { useBoloTodo } from '@/hooks/useBoloTodo';
import { useRootStore } from '@/store/RootStore';
import { LinearGradient } from 'expo-linear-gradient';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function VoiceLandingScreenComponent() {
  const { todosStore } = useRootStore();
  const {
    startVoice,
    stopVoice,
    processAndSaveVoice,
    getAvailableInputs,
    setAudioInput,
    isTranscribing,
    isParsing,
  } = useBoloTodo();

  const [activeTab, setActiveTab] = useState<TabKey>('record');
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'paused'>('idle');
  const [seconds, setSeconds] = useState(0);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [selectedMic, setSelectedMic] = useState('Built-in Mobile Mic');
  const [availableInputs, setAvailableInputs] = useState<Array<{ uid: string; name: string }>>([]);

  const [editingTodo, setEditingTodo] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    let timer: any;
    if (recordingState === 'recording') {
      timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [recordingState]);

  useEffect(() => {
    try {
      const inputs = getAvailableInputs();
      if (inputs && inputs.length > 0) setAvailableInputs(inputs);
    } catch { }
  }, [getAvailableInputs]);

  const formatTimer = (s: number) => `${Math.floor(s / 60)}:${s % 60 < 10 ? '0' : ''}${s % 60}`;

  const handleSelectMic = (name: string, uid?: string) => {
    setSelectedMic(name);
    if (uid) setAudioInput(uid);
  };

  const handleStartRecording = async () => {
    setSeconds(0);
    await startVoice();
    setRecordingState('recording');
  };

  const handleStopRecording = async () => {
    const uri = await stopVoice();
    setRecordingState('idle');
    if (uri) {
      setAudioUri(uri);
      setIsSheetVisible(true);
    }
  };

  const handleSaveNote = async (manualTitle?: string) => {
    setIsSheetVisible(false);
    if (audioUri) {
      await processAndSaveVoice(audioUri, manualTitle);
      setAudioUri(null);
    }
    setSeconds(0);
    setActiveTab('history');
  };

  const isIdle = recordingState === 'idle';
  const isProcessing = isTranscribing || isParsing;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F9FAF9', '#D9E3DF', '#4E7365', '#334F45']}
        locations={[0, 0.35, 0.72, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {isIdle ? (
          <TabSliderContainer activeTab={activeTab}>
            <RecordTabHome
              totalCount={todosStore.todos.length}
              onStartRecording={handleStartRecording}
            />
            <HistoryTabContent
              todos={todosStore.todos.slice()}
              onToggle={todosStore.toggleTodo}
              onEdit={(todo) => {
                setEditingTodo(todo);
                setIsEditDialogOpen(true);
              }}
              onDelete={todosStore.deleteTodo}
            />
            <SettingsTabContent
              availableInputs={availableInputs}
              selectedMic={selectedMic}
              onSelectMic={handleSelectMic}
            />
          </TabSliderContainer>
        ) : (
          <View style={styles.recordingContent}>
            <View style={styles.heroSection}>
              <Text style={styles.titleText}>AI-Powered{'\n'}Recording Made{'\n'}Simple</Text>
              <View style={styles.timerContainer}>
                <View style={styles.statusIndicator}>
                  <View
                    style={[
                      styles.statusDot,
                      recordingState === 'recording' ? styles.liveDot : styles.pausedDot,
                    ]}
                  />
                  <Text style={styles.statusLabel}>
                    {recordingState === 'recording' ? 'Recording' : 'Paused'}
                  </Text>
                </View>
                <Text style={styles.timerDisplay}>{formatTimer(seconds)}</Text>
              </View>
            </View>

            <View style={styles.waveformSection}>
              <Waveform isRecording={recordingState === 'recording'} />
            </View>

            <RecordingControls
              isRecording={recordingState === 'recording'}
              onStop={handleStopRecording}
              onPauseToggle={() =>
                setRecordingState((prev) => (prev === 'recording' ? 'paused' : 'recording'))
              }
            />
          </View>
        )}

        {isProcessing && (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', zIndex: 999 }]}>
            <View style={{ backgroundColor: '#ffffff', padding: 24, borderRadius: 20, alignItems: 'center', minWidth: 180 }}>
              <ActivityIndicator size="large" color="#284F41" />
              <Text style={{ marginTop: 14, fontSize: 15, fontWeight: '700', color: '#1A2420' }}>
                {isTranscribing ? 'Transcribing Urdu' : 'AI Analyzing Reminder'}
              </Text>
            </View>
          </View>
        )}

        {isIdle && (
          <FloatingBottomBar activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        <SaveRecordingSheet
          visible={isSheetVisible}
          audioUri={audioUri}
          durationText={`00:${formatTimer(seconds)}`}
          onClose={() => {
            setIsSheetVisible(false);
            setAudioUri(null);
          }}
          onSave={handleSaveNote}
        />

        <EditTodoDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          todo={editingTodo}
          onSave={(id, title, cat, due) =>
            todosStore.todos.find((t) => t.id === id)?.updateDetails(title, due, cat)
          }
        />
      </SafeAreaView>
    </View>
  );
}

const VoiceLandingScreen = observer(VoiceLandingScreenComponent);
export default VoiceLandingScreen;