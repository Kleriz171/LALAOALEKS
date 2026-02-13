import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AdminUser, AdminUserListResponse } from '../../types';
import {
  AnimatedCard,
  AnimatedListItem,
  COLORS,
} from '../../components/animations';
import api from '../../services/api';

const ROLE_FILTERS = ['All', 'Admins', 'Coaches', 'Banned'] as const;

export default function AdminUsersSegment() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<typeof ROLE_FILTERS[number]>('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadUsers = useCallback(async (p = 1, append = false) => {
    setLoading(true);
    try {
      const roleMap: Record<string, string | undefined> = {
        All: undefined,
        Admins: 'admin',
        Coaches: 'coach',
        Banned: 'banned',
      };
      const data: AdminUserListResponse = await api.getAdminUsers({
        page: p,
        limit: 20,
        search: search || undefined,
        role: roleMap[roleFilter],
      });
      setUsers(append ? prev => [...prev, ...data.users] : data.users);
      setPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => { loadUsers(1); }, [roleFilter]);

  const handleSearch = () => loadUsers(1);

  const handleToggleAdmin = (user: AdminUser) => {
    const newVal = !user.isAdmin;
    Alert.alert(
      newVal ? 'Grant Admin' : 'Remove Admin',
      `${newVal ? 'Grant' : 'Remove'} admin privileges for ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: newVal ? 'default' : 'destructive',
          onPress: async () => {
            try {
              await api.updateAdminUser(user.id, { isAdmin: newVal });
              loadUsers(1);
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Failed to update user');
            }
          },
        },
      ]
    );
  };

  const handleToggleCoach = (user: AdminUser) => {
    const newVal = !user.isCoach;
    Alert.alert(
      newVal ? 'Grant Coach' : 'Remove Coach',
      `${newVal ? 'Grant' : 'Remove'} coach status for ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              await api.updateAdminUser(user.id, { isCoach: newVal });
              loadUsers(1);
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Failed to update user');
            }
          },
        },
      ]
    );
  };

  const handleBan = (user: AdminUser) => {
    const banning = !user.isBanned;
    Alert.alert(
      banning ? 'Ban User' : 'Unban User',
      banning
        ? `Ban ${user.name}? They will not be able to use the platform.`
        : `Unban ${user.name}? They will regain access.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: banning ? 'Ban' : 'Unban',
          style: banning ? 'destructive' : 'default',
          onPress: async () => {
            try {
              await api.banAdminUser(user.id, banning);
              loadUsers(1);
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Failed to update user');
            }
          },
        },
      ]
    );
  };

  const handleDelete = (user: AdminUser) => {
    Alert.alert(
      'Delete User',
      `Permanently delete ${user.name} (${user.email})? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteAdminUser(user.id);
              loadUsers(1);
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const renderUserCard = (user: AdminUser, index: number) => {
    const isExpanded = expandedId === user.id;
    const isBanned = user.isBanned;

    return (
      <AnimatedListItem key={user.id} index={index} enterFrom="right">
        <AnimatedCard
          style={[styles.userCard, isBanned && styles.userCardBanned]}
          onPress={() => setExpandedId(isExpanded ? null : user.id)}
        >
          <View style={styles.userCardHeader}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, isBanned && styles.userNameBanned]}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
            <View style={styles.badges}>
              {user.isAdmin && <View style={[styles.badge, styles.adminBadge]}><Text style={styles.badgeText}>Admin</Text></View>}
              {user.isCoach && <View style={[styles.badge, styles.coachBadge]}><Text style={styles.badgeText}>Coach</Text></View>}
              {isBanned && <View style={[styles.badge, styles.bannedBadge]}><Text style={styles.bannedBadgeText}>BANNED</Text></View>}
            </View>
          </View>
          <View style={styles.userMeta}>
            <Text style={styles.userMetaText}>Joined {new Date(user.createdAt).toLocaleDateString()}</Text>
            <Text style={styles.userMetaText}>{user._count.workoutSessions} workouts</Text>
            <Text style={styles.userMetaText}>{user._count.nutritionLogs} logs</Text>
          </View>
          {(user.goal || user.experienceLevel) && (
            <View style={styles.tagRow}>
              {user.goal && (
                <View style={styles.infoTag}>
                  <Text style={styles.infoTagText}>{user.goal.replace(/_/g, ' ')}</Text>
                </View>
              )}
              {user.experienceLevel && (
                <View style={styles.infoTag}>
                  <Text style={styles.infoTagText}>{user.experienceLevel}</Text>
                </View>
              )}
            </View>
          )}
          {isExpanded && (
            <View style={styles.userActions}>
              <TouchableOpacity
                style={[styles.actionBtn, user.isAdmin ? styles.actionBtnDanger : styles.actionBtnPrimary]}
                onPress={() => handleToggleAdmin(user)}
              >
                <Ionicons name={user.isAdmin ? 'shield-outline' : 'shield'} size={16} color="#fff" />
                <Text style={styles.actionBtnText}>{user.isAdmin ? 'Remove Admin' : 'Make Admin'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, user.isCoach ? styles.actionBtnWarning : styles.actionBtnSuccess]}
                onPress={() => handleToggleCoach(user)}
              >
                <Ionicons name={user.isCoach ? 'close-circle-outline' : 'fitness'} size={16} color="#fff" />
                <Text style={styles.actionBtnText}>{user.isCoach ? 'Remove Coach' : 'Make Coach'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, isBanned ? styles.actionBtnSuccess : styles.actionBtnBan]}
                onPress={() => handleBan(user)}
              >
                <Ionicons name={isBanned ? 'checkmark-circle' : 'ban'} size={16} color="#fff" />
                <Text style={styles.actionBtnText}>{isBanned ? 'Unban' : 'Ban'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnDanger]}
                onPress={() => handleDelete(user)}
              >
                <Ionicons name="trash-outline" size={16} color="#fff" />
                <Text style={styles.actionBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </AnimatedCard>
      </AnimatedListItem>
    );
  };

  const totalCount = users.length > 0 ? `${users.length}${page < totalPages ? '+' : ''} users` : '';

  return (
    <View>
      {totalCount !== '' && (
        <View style={styles.countHeader}>
          <Ionicons name="people" size={16} color={COLORS.primary} />
          <Text style={styles.countText}>{totalCount}</Text>
          {roleFilter !== 'All' && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{roleFilter}</Text>
            </View>
          )}
        </View>
      )}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name or email..."
          placeholderTextColor={COLORS.textTertiary}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.filterRow}>
        {ROLE_FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, roleFilter === f && styles.filterChipActive]}
            onPress={() => setRoleFilter(f)}
          >
            <Text style={[styles.filterChipText, roleFilter === f && styles.filterChipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading && users.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      ) : (
        <>
          {users.map((u, i) => renderUserCard(u, i))}
          {page < totalPages && (
            <TouchableOpacity
              style={styles.loadMoreBtn}
              onPress={() => loadUsers(page + 1, true)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.primary} size="small" />
              ) : (
                <Text style={styles.loadMoreText}>Load More</Text>
              )}
            </TouchableOpacity>
          )}
          {users.length === 0 && !loading && (
            <Text style={styles.emptyText}>No users found</Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  userCard: {
    marginBottom: 10,
    padding: 14,
  },
  userCardBanned: {
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.5)',
  },
  userCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3498db',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  userNameBanned: {
    textDecorationLine: 'line-through',
    color: COLORS.textTertiary,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  adminBadge: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
  },
  coachBadge: {
    backgroundColor: 'rgba(230, 126, 34, 0.2)',
  },
  bannedBadge: {
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
  },
  bannedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  userMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  userMetaText: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  infoTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(26, 188, 156, 0.15)',
  },
  infoTagText: {
    fontSize: 11,
    color: '#1abc9c',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexWrap: 'wrap',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnPrimary: {
    backgroundColor: '#3498db',
  },
  actionBtnSuccess: {
    backgroundColor: '#2ecc71',
  },
  actionBtnWarning: {
    backgroundColor: '#e67e22',
  },
  actionBtnDanger: {
    backgroundColor: '#e74c3c',
  },
  actionBtnBan: {
    backgroundColor: '#c0392b',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  loadMoreBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
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
  countHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  countText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(52, 152, 219, 0.15)',
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
