import { StyleSheet } from 'react-native';

export const landingStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  idleContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  greetingSection: {
    marginTop: 8,
  },
  subGreeting: {
    fontSize: 15,
    color: '#496157',
    fontWeight: '500',
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#15241F',
    letterSpacing: -0.5,
  },
  centerMicSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  recordingContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 28,
    marginTop: 15,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A2621',
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  liveDot: {
    backgroundColor: '#E65100',
  },
  pausedDot: {
    backgroundColor: '#9E9E9E',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#34463F',
  },
  timerDisplay: {
    fontSize: 54,
    fontWeight: '700',
    color: '#13201B',
    letterSpacing: -1,
  },
  waveformSection: {
    width: '100%',
    paddingVertical: 10,
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  historyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#152520',
  },
  historySubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#395349',
    backgroundColor: '#DEE7E2',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
});
