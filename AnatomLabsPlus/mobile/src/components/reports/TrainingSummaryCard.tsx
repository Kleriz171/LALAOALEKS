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

export default function TrainingSummaryCard({ report, delay = 300 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { training } = report;

  return (
    <SlideIn direction="bottom" delay={delay}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => setExpanded(!expanded)}>
        <GlassCard style={styles.container} contentStyle={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={[styles.icon, { backgroundColor: COLORS.success + '20' }]}>
                <Ionicons name="barbell-outline" size={24} color={COLORS.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Training</Text>
                <Text style={styles.subtitle}>{training.workoutsCompleted} workout{training.workoutsCompleted !== 1 ? 's' : ''}</Text>
              </View>
            </View>
            <Ionicons name="chevron-down" size={24} color={COLORS.textSecondary} style={expanded ? styles.rotated : undefined} />
          </View>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: COLORS.success }]}>{training.workoutsCompleted}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: COLORS.info }]}>
                {training.totalWeight >= 1000 ? `${(training.totalWeight / 1000).toFixed(1)}t` : `${Math.round(training.totalWeight)}`}
              </Text>
              <Text style={styles.statLabel}>Total Weight</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: COLORS.primary }]}>{training.totalVolume}</Text>
              <Text style={styles.statLabel}>Sets</Text>
            </View>
          </View>

          {expanded && (
            <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={styles.expanded}>
              {training.sessions.length > 0 ? (
                training.sessions.map((session, idx) => (
                  <View key={idx} style={styles.session}>
                    <View style={styles.sessionHeader}>
                      <View style={styles.sessionNameRow}>
                        <Ionicons name="fitness-outline" size={18} color={COLORS.success} />
                        <Text style={styles.sessionName}>{session.name}</Text>
                      </View>
                      {session.duration > 0 && <Text style={styles.sessionDuration}>{session.duration} min</Text>}
                    </View>
                    <View style={styles.sessionStats}>
                      <View style={styles.sessionStatItem}>
                        <Text style={styles.sessionStatVal}>
                          {session.totalVolume >= 1000 ? `${(session.totalVolume / 1000).toFixed(1)}t` : `${Math.round(session.totalVolume)} kg`}
                        </Text>
                        <Text style={styles.sessionStatLbl}>Volume</Text>
                      </View>
                      <View style={styles.sessionStatItem}>
                        <Text style={styles.sessionStatVal}>{session.totalSets}</Text>
                        <Text style={styles.sessionStatLbl}>Sets</Text>
                      </View>
                      <View style={styles.sessionStatItem}>
                        <Text style={styles.sessionStatVal}>{session.totalReps}</Text>
                        <Text style={styles.sessionStatLbl}>Reps</Text>
                      </View>
                    </View>
                    {session.musclesWorked.length > 0 && (
                      <View style={styles.muscles}>
                        {session.musclesWorked.map((m, i) => (
                          <View key={i} style={styles.muscleBadge}>
                            <Text style={styles.muscleBadgeText}>{m}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))
              ) : (
                <View style={styles.empty}>
                  <Ionicons name="barbell-outline" size={32} color={COLORS.textTertiary} />
                  <Text style={styles.emptyText}>No workouts recorded</Text>
                </View>
              )}
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
  stats: { flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
  stat: { flex: 1, alignItems: 'center' },
  divider: { width: 1, height: 40, backgroundColor: COLORS.border },
  statValue: { fontSize: 28, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  expanded: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
  session: { backgroundColor: COLORS.cardBackgroundLight, borderRadius: 12, padding: 14, marginBottom: 10 },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sessionNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  sessionName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  sessionDuration: { fontSize: 13, color: COLORS.textSecondary },
  sessionStats: { flexDirection: 'row', justifyContent: 'space-around' },
  sessionStatItem: { alignItems: 'center' },
  sessionStatVal: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  sessionStatLbl: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  muscles: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  muscleBadge: { backgroundColor: COLORS.success + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  muscleBadgeText: { fontSize: 11, fontWeight: '600', color: COLORS.success, textTransform: 'capitalize' },
  empty: { alignItems: 'center', paddingVertical: 16 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 10 },
});
