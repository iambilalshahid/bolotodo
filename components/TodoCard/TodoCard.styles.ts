import { StyleSheet } from 'react-native';

export const todoCardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  completedCard: {
    opacity: 0.65,
    backgroundColor: '#F3F6F4',
  },
  checkboxWrapper: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#152520',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#657B72',
  },
  urduText: {
    fontSize: 12,
    color: '#637970',
    fontStyle: 'italic',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  categoryBadge: {
    backgroundColor: '#E7EFEA',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#284F41',
  },
  alarmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFECE5',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  alarmText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E64A19',
  },
  menuBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  pressed: {
    backgroundColor: '#EEF2F0',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 34,
    gap: 8,
  },
  sheetHeader: {
    fontSize: 17,
    fontWeight: '800',
    color: '#15241F',
    marginBottom: 6,
  },
  actionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    borderRadius: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F1EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTextWrap: {
    flex: 1,
  },
  actionOptionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#15241F',
  },
  actionOptionSub: {
    fontSize: 12,
    color: '#657B72',
    marginTop: 1,
  },
  deleteOption: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 4,
    paddingTop: 14,
  },
});