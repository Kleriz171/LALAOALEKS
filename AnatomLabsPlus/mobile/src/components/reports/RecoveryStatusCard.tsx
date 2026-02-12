import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, SlideIn, COLORS } from '../animations';

interface Props {
  injuryRisk: any;
  delay?: number;
}

const getRiskColor = (level: string) => {
  switch (level) {
    case 'low': return COLORS.success;
    case 'moderate': return COLORS.warning;
    case 'high': return '#e67e22';
    case 'very_high': return COLORS.error;
    default: return COLORS.textSecondary;
  }
};

const getRiskIcon = (level: string) => {
  switch (level) {
    case 'low': return 'checkmark-circle';
    case 'moderate': return 'alert-circle';
    case 'high': case 'very_high': return 'warning';
    default: return 'help-circle';
  }
};

export default function RecoveryStatusCard({ injuryRisk, delay = 150 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const risk = injuryRisk?.overallRisk || 'low';
  const color = getRiskColor(risk);

  const description = injuryRisk?.needsRestDay
    ? 'Rest recommended - your muscles need recovery time'
    : risk === 'low' ? 'All systems go! Your body is well-recovered'
    : risk === 'moderate' ? 'Light training recommended - some muscle groups need rest'
    : 'Caution advised - high fatigue detected';

  return (
    <SlideIn direction="bottom" delay={delay}>
      <TouchableOpacity activeOpacity={0.8} onPress={() => setExpanded(!expanded)}>
        <GlassCard style={styles.container} contentStyle={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={[styles.icon, { backgroundColor: color + '20' }]}>
                <Ionicons name={getRiskIcon(risk) as any} size={24} color={color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Recovery Status</Text>
                <Text style={[styles.subtitle, { color }]}>{risk.replace('_', ' ').toUpperCase()} RISK</Text>
              </View>
            </View>
            <Ionicons name="chevron-down" size={24} color={COLORS.textSecondary} style={expanded ? styles.rotated : undefined} />
          </View>

          <Text style={styles.description}>{description}</Text>

          {expanded && (
            <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={styles.expanded}>
              {injuryRisk?.recommendations?.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Recommendations</Text>
                  {injuryRisk.recommendations.map((rec: string, i: number) => (
                    <View key={i} style={styles.recItem}>
                      <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                      <Text style={styles.recText}>{rec}</Text>
                    </View>
                  ))}
                </View>
              )}

              {injuryRisk?.musclesAtRisk?.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Muscles Needing Rest</Text>
                  {injuryRisk.musclesAtRisk.map((m: any, i: number) => (
                    <View key={i} style={styles.muscleItem}>
                      <View style={styles.muscleLeft}>
                        <Ionicons name="body-outline" size={18} color={COLORS.textSecondary} />
                        <Text style={styles.muscleName}>{m.muscle?.name || 'Unknown'}</Text>
                      </View>
                      <View style={[styles.riskBadge, { backgroundColor: getRiskColor(m.riskLevel) + '20' }]}>
                        <Text style={[styles.riskBadgeText, { color: getRiskColor(m.riskLevel) }]}>
                          {m.riskLevel?.replace('_', ' ').toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {(!injuryRisk?.musclesAtRisk?.length && !injuryRisk?.recommendations?.length) && (
                <View style={styles.noIssues}>
                  <Ionicons name="thumbs-up" size={32} color={COLORS.success} />
                  <Text style={styles.noIssuesText}>No muscle fatigue detected. Ready for your next workout!</Text>
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
  subtitle: { fontSize: 13, marginTop: 2 },
  rotated: { transform: [{ rotate: '180deg' }] },
  description: { fontSize: 14, color: COLORS.textSecondary, marginTop: 12, lineHeight: 20 },
  expanded: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 10 },
  recItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  recText: { flex: 1, fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  muscleItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  muscleLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  muscleName: { fontSize: 14, fontWeight: '500', color: COLORS.text },
  riskBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  riskBadgeText: { fontSize: 10, fontWeight: '700' },
  noIssues: { alignItems: 'center', paddingVertical: 16 },
  noIssuesText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 10 },
});
