import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AdminCoachApplication } from '../../types';
import {
  AnimatedCard,
  AnimatedListItem,
  COLORS,
} from '../../components/animations';
import api from '../../services/api';

const APP_FILTERS = ['All', 'Pending', 'Approved', 'Rejected'] as const;

interface Props {
  onStatsChange?: () => void;
}

export default function AdminApplicationsSegment({ onStatsChange }: Props) {
  const [applications, setApplications] = useState<AdminCoachApplication[]>([]);
  const [filter, setFilter] = useState<typeof APP_FILTERS[number]>('All');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const statusMap: Record<string, string | undefined> = {
        All: undefined,
        Pending: 'PENDING',
        Approved: 'APPROVED',
        Rejected: 'REJECTED',
      };
      const data = await api.getAdminApplications(statusMap[filter]);
      setApplications(data);
    } catch (e) {
      console.error('Failed to load applications:', e);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = (app: AdminCoachApplication) => {
    Alert.alert('Approve Application', `Approve ${app.user.name} as a coach?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: async () => {
          try {
            await api.approveApplication(app.id);
            load();
            onStatsChange?.();
          } catch (error: any) {
            Alert.alert('Error', error?.message || 'Failed to approve');
          }
        },
      },
    ]);
  };

  const handleReject = (app: AdminCoachApplication) => {
    Alert.prompt(
      'Reject Application',
      `Rejection note for ${app.user.name} (optional):`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async (note?: string) => {
            try {
              await api.rejectApplication(app.id, note);
              load();
              onStatsChange?.();
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Failed to reject');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const statusColors: Record<string, string> = {
    PENDING: '#f39c12',
    APPROVED: '#2ecc71',
    REJECTED: '#e74c3c',
  };

  const renderAppCard = (app: AdminCoachApplication, index: number) => (
    <AnimatedListItem key={app.id} index={index} enterFrom="right">
      <AnimatedCard style={styles.appCard} pressable={false}>
        <View style={styles.appCardHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{app.user.name}</Text>
            <Text style={styles.userEmail}>{app.user.email}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColors[app.status]}20` }]}>
            <Text style={[styles.statusBadgeText, { color: statusColors[app.status] }]}>{app.status}</Text>
          </View>
        </View>
        <View style={styles.appDetails}>
          <View style={styles.specialtyRow}>
            {app.specialty.map(s => (
              <View key={s} style={styles.specialtyTag}>
                <Text style={styles.specialtyTagText}>{s}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.appExperience}>{app.experience} years experience</Text>
          <Text style={styles.appBio} numberOfLines={3}>{app.bio}</Text>
        </View>
        {app.reviewNote && (
          <View style={styles.reviewNoteBox}>
            <Text style={styles.reviewNoteLabel}>Review Note:</Text>
            <Text style={styles.reviewNoteText}>{app.reviewNote}</Text>
          </View>
        )}
        {app.status === 'PENDING' && (
          <View style={styles.appActions}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnSuccess, { flex: 1 }]}
              onPress={() => handleApprove(app)}
            >
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text style={styles.actionBtnText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnDanger, { flex: 1 }]}
              onPress={() => handleReject(app)}
            >
              <Ionicons name="close-circle" size={18} color="#fff" />
              <Text style={styles.actionBtnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </AnimatedCard>
    </AnimatedListItem>
  );

  return (
    <View>
      <View style={styles.filterRow}>
        {APP_FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : (
        <>
          {applications.map((a, i) => renderAppCard(a, i))}
          {applications.length === 0 && (
            <Text style={styles.emptyText}>No applications found</Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: '#fff',
  },
  appCard: {
    marginBottom: 10,
    padding: 14,
  },
  appCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  appDetails: {
    marginTop: 10,
  },
  specialtyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  specialtyTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(52, 152, 219, 0.15)',
  },
  specialtyTagText: {
    fontSize: 12,
    color: '#3498db',
    fontWeight: '600',
  },
  appExperience: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  appBio: {
    fontSize: 13,
    color: COLORS.textTertiary,
    lineHeight: 18,
  },
  reviewNoteBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(243, 156, 18, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(243, 156, 18, 0.2)',
  },
  reviewNoteLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f39c12',
    marginBottom: 4,
  },
  reviewNoteText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  appActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnSuccess: {
    backgroundColor: '#2ecc71',
  },
  actionBtnDanger: {
    backgroundColor: '#e74c3c',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 15,
    paddingVertical: 40,
  },
});
