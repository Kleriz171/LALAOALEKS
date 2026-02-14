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
import { LinearGradient } from 'expo-linear-gradient';
import { AdminUser, AdminUserListResponse } from '../../types';
import {
  AnimatedCard,
  AnimatedListItem,
  GlassCard,
  COLORS,
} from '../../components/animations';
import api from '../../services/api';

const ROLE_FILTERS = ['All', 'Admins', 'Coaches', 'Banned'] as const;
const ROLE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  All: 'people',
  Admins: 'shield',
  Coaches: 'fitness',
  Banned: 'ban',
};
const ROLE_COLORS: Record<string, string> = {
  All: COLORS.primary,
  Admins: '#e74c3c',
  Coaches: '#e67e22',
  Banned: '#c0392b',
};

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

  const getAvatarColor = (name: string) => {
    const colors = ['#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f39c12', '#1abc9c', '#e67e22'];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  const renderUserCard = (user: AdminUser, index: number) => {
    const isExpanded = expandedId === user.id;
    const isBanned = user.isBanned;
    const avatarColor = getAvatarColor(user.name);

    return (
      <AnimatedListItem key={user.id} index={index} enterFrom="right">
        <AnimatedCard
          style={[styles.userCard, isBanned && styles.userCardBanned]}
          onPress={() => setExpandedId(isExpanded ? null : user.id)}
        >
          <View style={styles.userCardHeader}>
            <View style={[styles.avatarCircle, { backgroundColor: `${avatarColor}20` }]}>
              <Text style={[styles.avatarText, { color: avatarColor }]}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
              {user.isAdmin && (
                <View style={styles.avatarBadge}>
                  <Ionicons name="shield" size={8} color="#fff" />
                </View>
              )}
            </View>
            <View style={styles.userInfo}>
              <View style={styles.userNameRow}>
                <Text style={[styles.userName, isBanned && styles.userNameBanned]} numberOfLines={1}>
                  {user.name}
                </Text>
              </View>
              <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
            </View>
            <View style={styles.badges}>
              {user.isAdmin && (
                <View style={styles.roleBadge}>
                  <LinearGradient
                    colors={['rgba(231, 76, 60, 0.25)', 'rgba(231, 76, 60, 0.1)']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                  <Text style={[styles.roleBadgeText, { color: '#e74c3c' }]}>Admin</Text>
                </View>
              )}
              {user.isCoach && (
                <View style={styles.roleBadge}>
                  <LinearGradient
                    colors={['rgba(230, 126, 34, 0.25)', 'rgba(230, 126, 34, 0.1)']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                  <Text style={[styles.roleBadgeText, { color: '#e67e22' }]}>Coach</Text>
                </View>
              )}
              {isBanned && (
                <View style={[styles.roleBadge, styles.bannedBadge]}>
                  <Text style={styles.bannedBadgeText}>BANNED</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.userMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={12} color={COLORS.textTertiary} />
              <Text style={styles.userMetaText}>{new Date(user.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="barbell-outline" size={12} color={COLORS.textTertiary} />
              <Text style={styles.userMetaText}>{user._count.workoutSessions}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="nutrition-outline" size={12} color={COLORS.textTertiary} />
              <Text style={styles.userMetaText}>{user._count.nutritionLogs}</Text>
            </View>
          </View>

          {(user.goal || user.experienceLevel) && (
            <View style={styles.tagRow}>
              {user.goal && (
                <View style={styles.infoTag}>
                  <Ionicons name="flag-outline" size={10} color="#1abc9c" />
                  <Text style={styles.infoTagText}>{user.goal.replace(/_/g, ' ')}</Text>
                </View>
              )}
              {user.experienceLevel && (
                <View style={[styles.infoTag, { backgroundColor: 'rgba(52, 152, 219, 0.12)' }]}>
                  <Ionicons name="school-outline" size={10} color="#3498db" />
                  <Text style={[styles.infoTagText, { color: '#3498db' }]}>{user.experienceLevel}</Text>
                </View>
              )}
            </View>
          )}

          {isExpanded && (
            <View style={styles.userActions}>
              <View style={styles.actionsGrid}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: user.isAdmin ? 'rgba(231,76,60,0.15)' : 'rgba(52,152,219,0.15)' }]}
                  onPress={() => handleToggleAdmin(user)}
                >
                  <Ionicons name={user.isAdmin ? 'shield-outline' : 'shield'} size={16} color={user.isAdmin ? '#e74c3c' : '#3498db'} />
                  <Text style={[styles.actionBtnText, { color: user.isAdmin ? '#e74c3c' : '#3498db' }]}>
                    {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: user.isCoach ? 'rgba(230,126,34,0.15)' : 'rgba(46,204,113,0.15)' }]}
                  onPress={() => handleToggleCoach(user)}
                >
                  <Ionicons name={user.isCoach ? 'close-circle-outline' : 'fitness'} size={16} color={user.isCoach ? '#e67e22' : '#2ecc71'} />
                  <Text style={[styles.actionBtnText, { color: user.isCoach ? '#e67e22' : '#2ecc71' }]}>
                    {user.isCoach ? 'Remove Coach' : 'Make Coach'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: isBanned ? 'rgba(46,204,113,0.15)' : 'rgba(192,57,43,0.15)' }]}
                  onPress={() => handleBan(user)}
                >
                  <Ionicons name={isBanned ? 'checkmark-circle' : 'ban'} size={16} color={isBanned ? '#2ecc71' : '#c0392b'} />
                  <Text style={[styles.actionBtnText, { color: isBanned ? '#2ecc71' : '#c0392b' }]}>
                    {isBanned ? 'Unban' : 'Ban'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: 'rgba(231,76,60,0.15)' }]}
                  onPress={() => handleDelete(user)}
                >
                  <Ionicons name="trash-outline" size={16} color="#e74c3c" />
                  <Text style={[styles.actionBtnText, { color: '#e74c3c' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </AnimatedCard>
      </AnimatedListItem>
    );
  };

  const totalCount = users.length > 0 ? `${users.length}${page < totalPages ? '+' : ''} users` : '';

  return (
    <View>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrap}>
          <Ionicons name="search-outline" size={18} color={COLORS.textTertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search users..."
            placeholderTextColor={COLORS.textTertiary}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { setSearch(''); loadUsers(1); }} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color={COLORS.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterRow}>
        {ROLE_FILTERS.map(f => {
          const isActive = roleFilter === f;
          const color = ROLE_COLORS[f];
          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, isActive && { borderColor: color, backgroundColor: `${color}15` }]}
              onPress={() => setRoleFilter(f)}
            >
              <Ionicons name={ROLE_ICONS[f]} size={14} color={isActive ? color : COLORS.textTertiary} />
              <Text style={[styles.filterChipText, isActive && { color }]}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {totalCount !== '' && (
        <View style={styles.countHeader}>
          <Text style={styles.countText}>{totalCount}</Text>
          {roleFilter !== 'All' && (
            <View style={[styles.countBadge, { backgroundColor: `${ROLE_COLORS[roleFilter]}15` }]}>
              <Text style={[styles.countBadgeText, { color: ROLE_COLORS[roleFilter] }]}>{roleFilter}</Text>
            </View>
          )}
        </View>
      )}

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
                <View style={styles.loadMoreInner}>
                  <Ionicons name="chevron-down" size={18} color={COLORS.primary} />
                  <Text style={styles.loadMoreText}>Load More</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          {users.length === 0 && !loading && (
            <GlassCard style={styles.emptyCard}>
              <Ionicons name="people-outline" size={40} color={COLORS.textTertiary} />
              <Text style={styles.emptyText}>No users found</Text>
              <Text style={styles.emptySubtext}>Try a different search or filter</Text>
            </GlassCard>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 12,
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: COLORS.text,
  },
  clearBtn: {
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
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
  countHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  countText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  userCard: {
    marginBottom: 8,
    padding: 14,
  },
  userCardBanned: {
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  userCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e74c3c',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.cardBackground,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  userNameBanned: {
    textDecorationLine: 'line-through',
    color: COLORS.textTertiary,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 2,
  },
  badges: {
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'wrap',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    overflow: 'hidden',
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bannedBadge: {
    backgroundColor: 'rgba(231, 76, 60, 0.85)',
  },
  bannedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.textTertiary,
    opacity: 0.5,
  },
  userMetaText: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  infoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    backgroundColor: 'rgba(26, 188, 156, 0.12)',
  },
  infoTagText: {
    fontSize: 11,
    color: '#1abc9c',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  userActions: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    minWidth: '47%',
    flex: 1,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadMoreBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loadMoreInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
