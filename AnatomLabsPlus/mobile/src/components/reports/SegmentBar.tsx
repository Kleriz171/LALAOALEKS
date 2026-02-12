import React, { useRef, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../animations';
import { ReportSegment } from '../../types';

interface SegmentBarProps {
  active: ReportSegment;
  onChange: (segment: ReportSegment) => void;
}

const segments: { key: ReportSegment; label: string; icon: string }[] = [
  { key: 'overview', label: 'Overview', icon: 'grid-outline' },
  { key: 'trends', label: 'Trends', icon: 'trending-up-outline' },
  { key: 'training', label: 'Training', icon: 'barbell-outline' },
  { key: 'health', label: 'Health', icon: 'heart-outline' },
  { key: 'insights', label: 'Insights', icon: 'bulb-outline' },
  { key: 'share', label: 'Share', icon: 'share-outline' },
];

export default function SegmentBar({ active, onChange }: SegmentBarProps) {
  const scrollRef = useRef<ScrollView>(null);
  const activeIndex = segments.findIndex(s => s.key === active);

  useEffect(() => {
    if (scrollRef.current && activeIndex >= 0) {
      scrollRef.current.scrollTo({ x: Math.max(0, activeIndex * 100 - 50), animated: true });
    }
  }, [activeIndex]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {segments.map(seg => {
          const isActive = seg.key === active;
          return (
            <TouchableOpacity
              key={seg.key}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => onChange(seg.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={seg.icon as any}
                size={16}
                color={isActive ? '#fff' : COLORS.textSecondary}
              />
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {seg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  container: {
    paddingHorizontal: 4,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  pillTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});
