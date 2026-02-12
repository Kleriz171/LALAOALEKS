import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, SlideIn, COLORS } from '../animations';
import { DailyReport } from '../../types';

interface Props {
  report: DailyReport;
  delay?: number;
}

export default function NutritionSummaryCard({ report, delay = 200 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { nutrition } = report;

  return (
    <SlideIn direction="bottom" delay={delay}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => setExpanded(!expanded)}>
        <GlassCard style={styles.container} contentStyle={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={[styles.icon, { backgroundColor: COLORS.primary + '20' }]}>
                <Ionicons name="nutrition-outline" size={24} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Nutrition</Text>
                <Text style={styles.subtitle}>{Math.round(nutrition.calories)} / {Math.round(nutrition.targetCalories)} cal</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <Text style={[styles.adherence, { color: nutrition.adherence >= 80 ? COLORS.success : COLORS.warning }]}>
                {Math.round(nutrition.adherence)}%
              </Text>
              <Ionicons name="chevron-down" size={24} color={COLORS.textSecondary} style={expanded ? styles.rotated : undefined} />
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(nutrition.adherence, 100)}%`, backgroundColor: nutrition.adherence >= 80 ? COLORS.success : COLORS.warning }]} />
            </View>
          </View>

          {expanded && (
            <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={styles.expanded}>
              {[
                { label: 'Protein', value: nutrition.protein, target: nutrition.targetProtein, unit: 'g', color: COLORS.primary },
                { label: 'Carbs', value: nutrition.carbs, target: nutrition.targetCarbs, unit: 'g', color: COLORS.info },
                { label: 'Fat', value: nutrition.fat, target: nutrition.targetFat, unit: 'g', color: COLORS.warning },
              ].map(m => (
                <View key={m.label} style={styles.macroItem}>
                  <View style={styles.macroHeader}>
                    <Text style={styles.macroLabel}>{m.label}</Text>
                    <Text style={[styles.macroValue, { color: m.color }]}>{Math.round(m.value)}{m.unit}</Text>
                  </View>
                  <View style={styles.macroBar}>
                    <View style={[styles.macroBarFill, { width: `${Math.min((m.value / m.target) * 100, 100)}%`, backgroundColor: m.color }]} />
                  </View>
                  <Text style={styles.macroTarget}>Target: {Math.round(m.target)}{m.unit}</Text>
                </View>
              ))}
            </Animated.View>
          )}
        </GlassCard>
      </TouchableOpacity>
    </SlideIn>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  content: { padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  adherence: { fontSize: 18, fontWeight: '700' },
  rotated: { transform: [{ rotate: '180deg' }] },
  progressContainer: { marginTop: 12 },
  progressBar: { height: 6, backgroundColor: COLORS.cardBackgroundLight, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  expanded: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 16 },
  macroItem: { gap: 6 },
  macroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  macroLabel: { fontSize: 14, color: COLORS.text, fontWeight: '500' },
  macroValue: { fontSize: 14, fontWeight: '700' },
  macroBar: { height: 8, backgroundColor: COLORS.cardBackgroundLight, borderRadius: 4, overflow: 'hidden' },
  macroBarFill: { height: '100%', borderRadius: 4 },
  macroTarget: { fontSize: 11, color: COLORS.textTertiary },
});
