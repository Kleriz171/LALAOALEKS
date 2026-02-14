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
import { LinearGradient } from 'expo-linear-gradient';
import { AdminCoachApplication } from '../../types';
import {
  AnimatedCard,
  AnimatedListItem,
  GlassCard,
  COLORS,
} from '../../components/animations';
import api from '../../services/api';

const APP_FILTERS = ['All', 'Pending', 'Approved', 'Rejected'] as const;
const FILTER_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  All: 'list',
  Pending: 'hourglass',
  Approved: 'checkmark-circle',
  Rejected: 'close-circle',
};
const FILTER_COLORS: Record<string, string> = {
  All: COLORS.primary,
  Pending: '#f39c12',
  Approved: '#2ecc71',
  Rejected: '#e74c3c',
};

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

  const statusConfig: Record<string, { color: string; icon: keyof typeof Ionicons.glyphMap; bg: string }> = {
    PENDING: { color: '#f39c12', icon: 'hourglass', bg: 'rgba(243,156,18,0.12)' },
    APPROVED: { color: '#2ecc71', icon: 'checkmark-circle', bg: 'rgba(46,204,113,0.12)' },
    REJECTED: { color: '#e74c3c', icon: 'close-circle', bg: 'rgba(231,76,60,0.12)' },
  };

  const renderAppCard = (app: AdminCoachApplication, index: number) => {
    const status = statusConfig[app.status] || statusConfig.PENDING;

    return (
      <AnimatedListItem key={app.id} index={index} enterFrom="right">
        <AnimatedCard style={styles.appCard} pressable={false}>
          <View style={styles.appCardHeader}>
            <View style={styles.applicantInfo}>
              <View style={styles.applicantAvatar}>
                <Text style={styles.applicantAvatarText}>{app.user.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.applicantDetails}>
                <Text style={styles.applicantName}>{app.user.name}</Text>
                <Text style={styles.applicantEmail}>{app.user.email}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Ionicons name={status.icon} size={12} color={status.color} />
              <Text style={[styles.statusBadgeText, { color: status.color }]}>{app.status}</Text>
            </View>
          </View>

          <View style={styles.appBody}>
            {app.specialty.length > 0 && (
              <View style={styles.specialtySection}>
                <View style={styles.specialtyRow}>
                  {app.specialty.map(s => (
                    <View key={s} style={styles.specialtyTag}>
                      <Text style={styles.specialtyTagText}>{s}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.appMetaRow}>
              <View style={styles.appMetaItem}>
                <Ionicons name="time-outline" size={14} color={COLORS.textTertiary} />
                <Text style={styles.appMetaText}>{app.experience} years exp</Text>
              </View>
              <View style={styles.appMetaDot} />
              <View style={styles.appMetaItem}>
                <Ionicons name="calendar-outline" size={14} color={COLORS.textTertiary} />
                <Text style={styles.appMetaText}>
                  {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                </Text>
              </View>
            </View>

            {app.bio && (
              <View style={styles.bioSection}>
                <Text style={styles.bioText} numberOfLines={3}>{app.bio}</Text>
              </View>
            )}
          </View>

          {app.reviewNote && (
            <View style={styles.reviewNoteBox}>
              <View style={styles.reviewNoteHeader}>
                <Ionicons name="chatbubble-outline" size={12} color="#f39c12" />
                <Text style={styles.reviewNoteLabel}>Review Note</Text>
              </View>
              <Text style={styles.reviewNoteText}>{app.reviewNote}</Text>
            </View>
          )}

          {app.status === 'PENDING' && (
            <View style={styles.appActions}>
              <TouchableOpacity
                style={styles.approveBtn}
                onPress={() => handleApprove(app)}
              >
                <LinearGradient
                  colors={['rgba(46, 204, 113, 0.2)', 'rgba(46, 204, 113, 0.08)']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <Ionicons name="checkmark-circle" size={18} color="#2ecc71" />
                <Text style={[styles.actionBtnText, { color: '#2ecc71' }]}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => handleReject(app)}
              >
                <LinearGradient
                  colors={['rgba(231, 76, 60, 0.2)', 'rgba(231, 76, 60, 0.08)']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <Ionicons name="close-circle" size={18} color="#e74c3c" />
                <Text style={[styles.actionBtnText, { color: '#e74c3c' }]}>Reject</Text>
              </TouchableOpacity>
            </View>
          )}
        </AnimatedCard>
      </AnimatedListItem>
    );
  };

  return (
    <View>
      <View style={styles.filterRow}>
        {APP_FILTERS.map(f => {
          const isActive = filter === f;
          const color = FILTER_COLORS[f];
          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, isActive && { borderColor: color, backgroundColor: `${color}15` }]}
              onPress={() => setFilter(f)}
            >
              <Ionicons name={FILTER_ICONS[f]} size={14} color={isActive ? color : COLORS.textTertiary} />
              <Text style={[styles.filterChipText, isActive && { color }]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : (
        <>
          {applications.map((a, i) => renderAppCard(a, i))}
          {applications.length === 0 && (
            <GlassCard style={styles.emptyCard}>
              <Ionicons name="document-text-outline" size={40} color={COLORS.textTertiary} />
              <Text style={styles.emptyText}>No applications found</Text>
              <Text style={styles.emptySubtext}>
                {filter === 'Pending' ? 'No pending reviews' : 'Try a different filter'}
              </Text>
            </GlassCard>
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 11,
    backgroundColor: COLORS.cardBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textTertiary,
  },
  appCard: {
    marginBottom: 10,
    padding: 16,
  },
  appCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  applicantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  applicantAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(155, 89, 182, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applicantAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9b59b6',
  },
  applicantDetails: {
    flex: 1,
  },
  applicantName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  applicantEmail: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  appBody: {
    marginTop: 12,
  },
  specialtySection: {
    marginBottom: 10,
  },
  specialtyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  specialtyTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.15)',
  },
  specialtyTagText: {
    fontSize: 11,
    color: '#3498db',
    fontWeight: '600',
  },
  appMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  appMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  appMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textTertiary,
    opacity: 0.5,
  },
  appMetaText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  bioSection: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  bioText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  reviewNoteBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(243, 156, 18, 0.06)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(243, 156, 18, 0.12)',
  },
  reviewNoteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  reviewNoteLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f39c12',
  },
  reviewNoteText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  appActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 11,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.2)',
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 11,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.2)',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.textTertiary,
  },
});
