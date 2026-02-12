import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../animations';

interface ComparisonItem {
  label: string;
  current: number;
  previous: number;
  unit?: string;
  formatValue?: (v: number) => string;
}

interface ComparisonBarsProps {
  items: ComparisonItem[];
  currentLabel?: string;
  previousLabel?: string;
  currentColor?: string;
  previousColor?: string;
}

export default function ComparisonBars({
  items,
  currentLabel = 'Current',
  previousLabel = 'Previous',
  currentColor = COLORS.primary,
  previousColor = COLORS.textTertiary,
}: ComparisonBarsProps) {
  const maxValue = Math.max(...items.flatMap(i => [i.current, i.previous]), 1);

  return (
    <View style={styles.container}>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: currentColor }]} />
          <Text style={styles.legendText}>{currentLabel}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: previousColor }]} />
          <Text style={styles.legendText}>{previousLabel}</Text>
        </View>
      </View>

      {items.map((item, index) => {
        const fmtVal = item.formatValue || ((v: number) => `${Math.round(v)}${item.unit || ''}`);
        const change = item.current - item.previous;
        const changePercent = item.previous > 0 ? Math.round((change / item.previous) * 100) : 0;

        return (
          <View key={index} style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <View style={styles.changeContainer}>
                <Text style={[styles.changeText, { color: change >= 0 ? COLORS.success : COLORS.error }]}>
                  {change >= 0 ? '+' : ''}{changePercent}%
                </Text>
              </View>
            </View>

            <View style={styles.barsRow}>
              <View style={styles.barContainer}>
                <View style={[styles.bar, { width: `${(item.current / maxValue) * 100}%`, backgroundColor: currentColor }]} />
                <Text style={styles.barValue}>{fmtVal(item.current)}</Text>
              </View>
              <View style={styles.barContainer}>
                <View style={[styles.bar, { width: `${(item.previous / maxValue) * 100}%`, backgroundColor: previousColor }]} />
                <Text style={styles.barValue}>{fmtVal(item.previous)}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  item: {
    gap: 6,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
  },
  changeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: COLORS.cardBackgroundLight,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  barsRow: {
    gap: 4,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bar: {
    height: 8,
    borderRadius: 4,
    minWidth: 4,
  },
  barValue: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});
