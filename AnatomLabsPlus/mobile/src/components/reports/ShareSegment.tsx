import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, COLORS } from '../animations';
import api from '../../services/api';

export default function ShareSegment() {
  const [generating, setGenerating] = useState(false);
  const [reportId, setReportId] = useState<string | null>(null);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>(['nutrition', 'training', 'activity', 'insights']);

  const sections = [
    { key: 'nutrition', label: 'Nutrition', icon: 'nutrition-outline', color: COLORS.primary },
    { key: 'training', label: 'Training', icon: 'barbell-outline', color: COLORS.success },
    { key: 'activity', label: 'Activity', icon: 'fitness-outline', color: COLORS.info },
    { key: 'health', label: 'Health', icon: 'heart-outline', color: COLORS.error },
    { key: 'insights', label: 'Insights', icon: 'bulb-outline', color: COLORS.warning },
  ];

  const toggleSection = (key: string) => {
    setSelectedSections(prev =>
      prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]
    );
  };

  const handleGenerate = async () => {
    if (selectedSections.length === 0) {
      Alert.alert('Select Sections', 'Please select at least one section to include');
      return;
    }

    setGenerating(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const report = await api.generateReport(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        selectedSections,
      );
      setReportId(report.id);
      Alert.alert('Report Generated', 'Your report has been generated successfully');
    } catch (e) {
      Alert.alert('Error', 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!reportId) {
      Alert.alert('Generate First', 'Generate a report before sharing');
      return;
    }

    try {
      const result = await api.shareReport(reportId, 72);
      setShareToken(result.shareToken);

      await Share.share({
        message: `Check out my fitness report! Token: ${result.shareToken}`,
        title: 'My Fitness Report',
      });
    } catch (e) {
      Alert.alert('Error', 'Failed to create share link');
    }
  };

  return (
    <View style={styles.container}>
      <GlassCard>
        <View style={styles.cardHeader}>
          <Ionicons name="document-text-outline" size={20} color={COLORS.info} />
          <Text style={styles.cardTitle}>Generate Report</Text>
        </View>
        <Text style={styles.description}>Create a comprehensive report of your last 30 days. Select which sections to include:</Text>

        <View style={styles.sectionGrid}>
          {sections.map(s => {
            const selected = selectedSections.includes(s.key);
            return (
              <TouchableOpacity
                key={s.key}
                style={[styles.sectionChip, selected && { backgroundColor: s.color + '20', borderColor: s.color }]}
                onPress={() => toggleSection(s.key)}
              >
                <Ionicons name={s.icon as any} size={18} color={selected ? s.color : COLORS.textTertiary} />
                <Text style={[styles.sectionChipText, selected && { color: s.color }]}>{s.label}</Text>
                {selected && <Ionicons name="checkmark-circle" size={16} color={s.color} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate} disabled={generating}>
          {generating ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.generateBtnText}>Generate Report</Text>
            </>
          )}
        </TouchableOpacity>
      </GlassCard>

      {reportId && (
        <GlassCard>
          <View style={styles.cardHeader}>
            <Ionicons name="share-outline" size={20} color={COLORS.success} />
            <Text style={styles.cardTitle}>Share & Export</Text>
          </View>

          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={handleShare}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.info + '20' }]}>
                <Ionicons name="link-outline" size={24} color={COLORS.info} />
              </View>
              <Text style={styles.actionLabel}>Share Link</Text>
              <Text style={styles.actionDesc}>Create a shareable link for coaches</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => Alert.alert('Coming Soon', 'PDF export will be available in a future update')}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.error + '20' }]}>
                <Ionicons name="document-outline" size={24} color={COLORS.error} />
              </View>
              <Text style={styles.actionLabel}>Export PDF</Text>
              <Text style={styles.actionDesc}>Download as PDF document</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => Alert.alert('Coming Soon', 'Image export will be available in a future update')}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.success + '20' }]}>
                <Ionicons name="image-outline" size={24} color={COLORS.success} />
              </View>
              <Text style={styles.actionLabel}>Save Image</Text>
              <Text style={styles.actionDesc}>Save report as image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={async () => {
              try {
                await Share.share({ message: 'Check out my AnatomLabs fitness report!', title: 'My Report' });
              } catch {}
            }}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.warning + '20' }]}>
                <Ionicons name="share-social-outline" size={24} color={COLORS.warning} />
              </View>
              <Text style={styles.actionLabel}>Share</Text>
              <Text style={styles.actionDesc}>Share via apps</Text>
            </TouchableOpacity>
          </View>

          {shareToken && (
            <View style={styles.tokenContainer}>
              <Text style={styles.tokenLabel}>Share Token</Text>
              <Text style={styles.tokenValue}>{shareToken.slice(0, 16)}...</Text>
              <Text style={styles.tokenExpiry}>Expires in 72 hours</Text>
            </View>
          )}
        </GlassCard>
      )}

      <GlassCard>
        <View style={styles.coachReady}>
          <Ionicons name="people-outline" size={32} color={COLORS.primary} />
          <Text style={styles.coachTitle}>Coach-Ready Reports</Text>
          <Text style={styles.coachDesc}>
            Generated reports are designed to be shared with coaches. They include comprehensive data summaries, trend analysis, and AI insights.
          </Text>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  description: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, marginBottom: 16 },
  sectionGrid: { gap: 8 },
  sectionChip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, backgroundColor: COLORS.cardBackgroundLight, borderWidth: 1, borderColor: COLORS.border },
  sectionChipText: { flex: 1, fontSize: 14, fontWeight: '500', color: COLORS.textSecondary },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 12, marginTop: 16 },
  generateBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionCard: { width: '47%', backgroundColor: COLORS.cardBackgroundLight, padding: 14, borderRadius: 12, gap: 6 },
  actionIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  actionDesc: { fontSize: 11, color: COLORS.textTertiary },
  tokenContainer: { marginTop: 16, padding: 12, backgroundColor: COLORS.cardBackgroundLight, borderRadius: 10 },
  tokenLabel: { fontSize: 11, color: COLORS.textTertiary },
  tokenValue: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginTop: 4, fontFamily: 'monospace' },
  tokenExpiry: { fontSize: 11, color: COLORS.warning, marginTop: 4 },
  coachReady: { alignItems: 'center', paddingVertical: 20, gap: 8 },
  coachTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  coachDesc: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 19, paddingHorizontal: 10 },
});
