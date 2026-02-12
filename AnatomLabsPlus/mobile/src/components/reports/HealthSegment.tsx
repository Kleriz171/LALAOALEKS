import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, Skeleton, COLORS } from '../animations';
import { LineChart } from '../charts';
import api from '../../services/api';
import { BiomarkerEntry, HealthSummary } from '../../types';

const biomarkerTypes = [
  { type: 'weight', label: 'Weight', unit: 'kg', icon: 'scale-outline', color: COLORS.info },
  { type: 'body_fat', label: 'Body Fat', unit: '%', icon: 'body-outline', color: COLORS.warning },
  { type: 'blood_pressure', label: 'Blood Pressure', unit: 'mmHg', icon: 'heart-outline', color: COLORS.error },
  { type: 'blood_glucose', label: 'Blood Glucose', unit: 'mg/dL', icon: 'water-outline', color: '#9b59b6' },
  { type: 'heart_rate', label: 'Heart Rate', unit: 'bpm', icon: 'pulse-outline', color: COLORS.primary },
  { type: 'waist', label: 'Waist', unit: 'cm', icon: 'resize-outline', color: COLORS.success },
];

export default function HealthSegment() {
  const [healthSummary, setHealthSummary] = useState<any>(null);
  const [biomarkers, setBiomarkers] = useState<BiomarkerEntry[]>([]);
  const [selectedType, setSelectedType] = useState('weight');
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const [inputNotes, setInputNotes] = useState('');

  useEffect(() => {
    loadData();
  }, [selectedType]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [summary, logs] = await Promise.all([
        api.getHealthSummary(),
        api.getBiomarkers(selectedType, 90),
      ]);
      setHealthSummary(summary);
      setBiomarkers(logs);
    } catch (e) {
      console.error('Failed to load health data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLog = async () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return;

    const config = biomarkerTypes.find(b => b.type === selectedType)!;
    try {
      await api.logBiomarker({
        type: selectedType,
        value: val,
        value2: inputValue2 ? parseFloat(inputValue2) : undefined,
        unit: config.unit,
        notes: inputNotes || undefined,
      });
      setShowInput(false);
      setInputValue('');
      setInputValue2('');
      setInputNotes('');
      loadData();
    } catch (e) {
      Alert.alert('Error', 'Failed to log biomarker');
    }
  };

  const config = biomarkerTypes.find(b => b.type === selectedType)!;
  const chartData = [...biomarkers].reverse().map(b => ({ date: b.date, value: b.value }));

  return (
    <View style={styles.container}>
      <View style={styles.typePills}>
        {biomarkerTypes.map(b => (
          <TouchableOpacity
            key={b.type}
            style={[styles.typePill, selectedType === b.type && { backgroundColor: b.color, borderColor: b.color }]}
            onPress={() => setSelectedType(b.type)}
          >
            <Ionicons name={b.icon as any} size={14} color={selectedType === b.type ? '#fff' : COLORS.textSecondary} />
            <Text style={[styles.typePillText, selectedType === b.type && { color: '#fff' }]}>{b.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <Skeleton width="100%" height={220} borderRadius={16} />
      ) : (
        <>
          <GlassCard>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{config.label} Trend</Text>
                {biomarkers.length > 0 && (
                  <Text style={[styles.latestValue, { color: config.color }]}>
                    Latest: {biomarkers[0].value}{biomarkers[0].value2 ? `/${biomarkers[0].value2}` : ''} {config.unit}
                  </Text>
                )}
              </View>
              <TouchableOpacity style={[styles.addBtn, { backgroundColor: config.color }]} onPress={() => setShowInput(true)}>
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {chartData.length > 1 ? (
              <LineChart data={chartData} color={config.color} height={160} yAxisSuffix={` ${config.unit}`} />
            ) : (
              <View style={styles.empty}>
                <Ionicons name={config.icon as any} size={32} color={COLORS.textTertiary} />
                <Text style={styles.emptyText}>Log your {config.label.toLowerCase()} to see trends</Text>
              </View>
            )}
          </GlassCard>

          {healthSummary?.healthConditions?.length > 0 && (
            <GlassCard>
              <View style={styles.cardHeader}>
                <Ionicons name="medical-outline" size={20} color={COLORS.error} />
                <Text style={styles.cardTitle}>Health Conditions</Text>
              </View>
              <View style={styles.conditionsList}>
                {healthSummary.healthConditions.map((c: string, i: number) => (
                  <View key={i} style={styles.conditionBadge}>
                    <Text style={styles.conditionText}>{c.replace(/_/g, ' ')}</Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          )}

          {biomarkers.length > 0 && (
            <GlassCard>
              <Text style={styles.cardTitle}>Recent Readings</Text>
              <View style={styles.readings}>
                {biomarkers.slice(0, 5).map((b, i) => (
                  <View key={i} style={styles.readingRow}>
                    <Text style={styles.readingDate}>{new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                    <Text style={[styles.readingValue, { color: config.color }]}>
                      {b.value}{b.value2 ? `/${b.value2}` : ''} {config.unit}
                    </Text>
                    {b.notes && <Text style={styles.readingNotes}>{b.notes}</Text>}
                  </View>
                ))}
              </View>
            </GlassCard>
          )}
        </>
      )}

      <Modal visible={showInput} transparent animationType="fade" onRequestClose={() => setShowInput(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowInput(false)}>
          <TouchableOpacity activeOpacity={1} onPress={(e: any) => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Log {config.label}</Text>

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder={`Value (${config.unit})`}
                  placeholderTextColor={COLORS.textTertiary}
                  keyboardType="decimal-pad"
                  value={inputValue}
                  onChangeText={setInputValue}
                />
                {selectedType === 'blood_pressure' && (
                  <TextInput
                    style={styles.input}
                    placeholder="Diastolic"
                    placeholderTextColor={COLORS.textTertiary}
                    keyboardType="decimal-pad"
                    value={inputValue2}
                    onChangeText={setInputValue2}
                  />
                )}
              </View>

              <TextInput
                style={[styles.input, { marginTop: 8 }]}
                placeholder="Notes (optional)"
                placeholderTextColor={COLORS.textTertiary}
                value={inputNotes}
                onChangeText={setInputNotes}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowInput(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: config.color }]} onPress={handleLog}>
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  typePills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typePill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, backgroundColor: COLORS.cardBackground, borderWidth: 1, borderColor: COLORS.border },
  typePillText: { fontSize: 11, fontWeight: '500', color: COLORS.textSecondary },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  latestValue: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  addBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingVertical: 30 },
  emptyText: { fontSize: 13, color: COLORS.textTertiary, marginTop: 8 },
  conditionsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  conditionBadge: { backgroundColor: COLORS.error + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  conditionText: { fontSize: 12, fontWeight: '500', color: COLORS.error, textTransform: 'capitalize' },
  readings: { marginTop: 8, gap: 8 },
  readingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  readingDate: { fontSize: 13, color: COLORS.textSecondary, width: 60 },
  readingValue: { fontSize: 14, fontWeight: '600' },
  readingNotes: { fontSize: 11, color: COLORS.textTertiary, flex: 1, textAlign: 'right' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: COLORS.cardBackground, borderRadius: 20, padding: 24, width: 320, borderWidth: 1, borderColor: COLORS.border },
  modalTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text, marginBottom: 16 },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: COLORS.cardBackgroundLight, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', backgroundColor: COLORS.cardBackgroundLight },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
  saveBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  saveBtnText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});
