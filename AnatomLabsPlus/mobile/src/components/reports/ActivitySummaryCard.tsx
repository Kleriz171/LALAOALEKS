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

export default function ActivitySummaryCard({ report, delay = 250 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { activity } = report;

  return (
    <SlideIn direction="bottom" delay={delay}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => setExpanded(!expanded)}>
        <GlassCard style={styles.container} contentStyle={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={[styles.icon, { backgroundColor: COLORS.info + '20' }]}>
                <Ionicons name="fitness-outline" size={24} color={COLORS.info} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Activity</Text>
                <Text style={styles.subtitle}>{activity.steps.toLocaleString()} steps</Text>
              </View>
            </View>
            <Ionicons name="chevron-down" size={24} color={COLORS.textSecondary} style={expanded ? styles.rotated : undefined} />
          </View>

          {expanded && (
            <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={styles.expanded}>
              {[
                { icon: 'footsteps-outline', label: 'Steps', value: activity.steps.toLocaleString(), color: COLORS.info },
                { icon: 'flame-outline', label: 'Calories Burned', value: `${Math.round(activity.caloriesBurned)} cal`, color: COLORS.primary },
                { icon: 'water-outline', label: 'Water Intake', value: `${activity.waterIntake} ml`, color: '#3498db' },
                { icon: 'moon-outline', label: 'Sleep', value: `${activity.sleepHours} hours`, color: '#9b59b6' },
              ].map(item => (
                <View key={item.label} style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon as any} size={22} color={item.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activityLabel}>{item.label}</Text>
                    <Text style={[styles.activityValue, { color: item.color }]}>{item.value}</Text>
                  </View>
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
  icon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  rotated: { transform: [{ rotate: '180deg' }] },
  expanded: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 12 },
  activityItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  activityIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  activityLabel: { fontSize: 13, color: COLORS.textSecondary },
  activityValue: { fontSize: 16, fontWeight: '600', marginTop: 2 },
});
