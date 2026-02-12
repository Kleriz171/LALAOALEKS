import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../animations';
import { DateRangeMode } from '../../types';

interface DateRangePickerProps {
  mode: DateRangeMode;
  selectedDate: Date;
  onModeChange: (mode: DateRangeMode) => void;
  onDateChange: (days: number) => void;
  onCalendarPress: () => void;
}

const modes: { key: DateRangeMode; label: string }[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

const formatDate = (date: Date, mode: DateRangeMode): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  if (mode === 'day') {
    if (compareDate.getTime() === today.getTime()) return 'Today';
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (compareDate.getTime() === yesterday.getTime()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  if (mode === 'week') {
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }

  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const getStepDays = (mode: DateRangeMode): number => {
  if (mode === 'day') return 1;
  if (mode === 'week') return 7;
  return 30;
};

export default function DateRangePicker({ mode, selectedDate, onModeChange, onDateChange, onCalendarPress }: DateRangePickerProps) {
  const isFuture = selectedDate.toDateString() === new Date().toDateString() && mode === 'day';
  const step = getStepDays(mode);

  return (
    <View style={styles.container}>
      <View style={styles.modeToggle}>
        {modes.map(m => (
          <TouchableOpacity
            key={m.key}
            style={[styles.modeButton, mode === m.key && styles.modeButtonActive]}
            onPress={() => onModeChange(m.key)}
          >
            <Text style={[styles.modeText, mode === m.key && styles.modeTextActive]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.dateNav}>
        <TouchableOpacity style={styles.navArrow} onPress={() => onDateChange(-step)}>
          <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateDisplay} onPress={onCalendarPress}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
          <Text style={styles.dateText}>{formatDate(selectedDate, mode)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navArrow, isFuture && styles.navArrowDisabled]}
          onPress={() => onDateChange(step)}
          disabled={isFuture}
        >
          <Ionicons name="chevron-forward" size={22} color={isFuture ? COLORS.textTertiary : COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginBottom: 16,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  modeText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modeTextActive: {
    color: '#fff',
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  navArrow: {
    padding: 6,
  },
  navArrowDisabled: {
    opacity: 0.3,
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
});
