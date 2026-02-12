import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, AnimatedProgressRing, SlideIn, COLORS } from '../animations';
import { DailyReport } from '../../types';

interface Props {
  report: DailyReport;
  injuryRisk: any;
}

const getScoreColor = (s: number) => s >= 80 ? COLORS.success : s >= 60 ? COLORS.warning : COLORS.error;
const getScoreLabel = (s: number) => s >= 90 ? 'Excellent' : s >= 80 ? 'Great' : s >= 70 ? 'Good' : s >= 60 ? 'Fair' : 'Needs Work';

export default function DailyScoreCard({ report, injuryRisk }: Props) {
  const nutritionScore = Math.min(report.nutrition.adherence, 100);
  const activityScore = Math.min((report.activity.steps / 10000) * 100, 100);
  const trainingScore = report.training.workoutsCompleted > 0 ? 100 : 50;
  const recoveryScore = injuryRisk?.overallRisk === 'low' ? 100 : injuryRisk?.overallRisk === 'moderate' ? 70 : 40;
  const score = Math.round((nutritionScore + activityScore + trainingScore + recoveryScore) / 4);
  const color = getScoreColor(score);

  return (
    <SlideIn direction="bottom" delay={100}>
      <GlassCard style={styles.container} contentStyle={styles.content} borderGlow glowColor={color}>
        <View style={styles.header}>
          <Text style={styles.label}>Daily Score</Text>
          <View style={[styles.badge, { backgroundColor: color + '20' }]}>
            <Text style={[styles.badgeText, { color }]}>{getScoreLabel(score)}</Text>
          </View>
        </View>
        <View style={styles.ring}>
          <AnimatedProgressRing progress={score} size={120} strokeWidth={10} color={color} label="" value={`${score}`} delay={200} />
        </View>
        <View style={styles.breakdown}>
          {[
            { icon: 'nutrition-outline', label: 'Nutrition', color: COLORS.primary },
            { icon: 'footsteps-outline', label: 'Activity', color: COLORS.info },
            { icon: 'barbell-outline', label: 'Training', color: COLORS.success },
            { icon: 'shield-checkmark-outline', label: 'Recovery', color: COLORS.warning },
          ].map(item => (
            <View key={item.label} style={styles.item}>
              <Ionicons name={item.icon as any} size={16} color={item.color} />
              <Text style={styles.itemText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </GlassCard>
    </SlideIn>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  content: { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  label: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  ring: { marginVertical: 8 },
  breakdown: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
  item: { alignItems: 'center', gap: 4 },
  itemText: { fontSize: 11, color: COLORS.textSecondary },
});
