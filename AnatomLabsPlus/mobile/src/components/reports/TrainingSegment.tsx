import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, Skeleton, COLORS } from '../animations';
import { BarChart } from '../charts';
import { HeatmapGrid } from '../charts';
import api from '../../services/api';
import { VolumeByMuscle, TrainingHeatmapDay } from '../../types';

export default function TrainingSegment() {
  const [volumeData, setVolumeData] = useState<VolumeByMuscle[]>([]);
  const [heatmapData, setHeatmapData] = useState<TrainingHeatmapDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [volume, heatmap] = await Promise.all([
        api.getVolumeByMuscle(30),
        api.getTrainingHeatmap(12),
      ]);
      setVolumeData(volume);
      setHeatmapData(heatmap);
    } catch (e) {
      console.error('Failed to load training data:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Skeleton width="100%" height={200} borderRadius={16} />
        <Skeleton width="100%" height={180} borderRadius={16} style={{ marginTop: 12 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlassCard>
        <View style={styles.cardHeader}>
          <Ionicons name="body-outline" size={20} color={COLORS.success} />
          <Text style={styles.cardTitle}>Volume by Muscle Group</Text>
        </View>
        {volumeData.length > 0 ? (
          <>
            <BarChart
              data={volumeData.slice(0, 8).map(v => ({
                label: v.muscle.length > 6 ? v.muscle.slice(0, 6) : v.muscle,
                value: v.totalSets,
                color: COLORS.success,
              }))}
              height={160}
              yAxisSuffix=" sets"
            />
            <View style={styles.muscleList}>
              {volumeData.slice(0, 6).map((v, i) => (
                <View key={i} style={styles.muscleRow}>
                  <View style={styles.muscleLeft}>
                    <View style={[styles.muscleRank, { backgroundColor: i < 3 ? COLORS.success + '20' : COLORS.cardBackgroundLight }]}>
                      <Text style={[styles.muscleRankText, { color: i < 3 ? COLORS.success : COLORS.textTertiary }]}>{i + 1}</Text>
                    </View>
                    <Text style={styles.muscleName}>{v.muscle}</Text>
                  </View>
                  <View style={styles.muscleRight}>
                    <Text style={styles.muscleSets}>{v.totalSets} sets</Text>
                    <Text style={styles.musclePercent}>{v.percentage}%</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.empty}>
            <Ionicons name="barbell-outline" size={32} color={COLORS.textTertiary} />
            <Text style={styles.emptyText}>No training data in the last 30 days</Text>
          </View>
        )}
      </GlassCard>

      <GlassCard>
        <View style={styles.cardHeader}>
          <Ionicons name="calendar-outline" size={20} color={COLORS.info} />
          <Text style={styles.cardTitle}>Training Frequency</Text>
        </View>
        {heatmapData.length > 0 ? (
          <HeatmapGrid
            data={heatmapData.map(d => ({ date: d.date, value: d.intensity }))}
            weeks={12}
            color={COLORS.success}
          />
        ) : (
          <View style={styles.empty}>
            <Ionicons name="grid-outline" size={32} color={COLORS.textTertiary} />
            <Text style={styles.emptyText}>Start training to see your heatmap</Text>
          </View>
        )}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  muscleList: { marginTop: 16, gap: 8 },
  muscleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  muscleLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  muscleRank: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  muscleRankText: { fontSize: 12, fontWeight: '700' },
  muscleName: { fontSize: 14, fontWeight: '500', color: COLORS.text, textTransform: 'capitalize' },
  muscleRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  muscleSets: { fontSize: 13, color: COLORS.textSecondary },
  musclePercent: { fontSize: 13, fontWeight: '600', color: COLORS.success, width: 40, textAlign: 'right' },
  empty: { alignItems: 'center', paddingVertical: 30 },
  emptyText: { fontSize: 13, color: COLORS.textTertiary, marginTop: 8 },
});
