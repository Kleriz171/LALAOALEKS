import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Dimensions, ActivityIndicator, StatusBar, Alert,
  Modal, TextInput, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue, useAnimatedScrollHandler, useAnimatedStyle,
  interpolate, Extrapolation, SlideInRight, FadeInDown,
  ZoomIn, withSpring, withSequence, withTiming,
} from 'react-native-reanimated';
import api from '../../services/api';
import { Coach, CoachPost, CoachReview } from '../../types';
import { useHaptics, FadeIn, SlideIn } from '../../components/animations';
import { COLORS } from '../../components/animations/config';

const { width: SW } = Dimensions.get('window');
const BG = COLORS.background;
const CARD = COLORS.cardBackground;
const BORDER = COLORS.border;
const TEXT = COLORS.text;
const TEXT2 = COLORS.textSecondary;
const TEXT3 = COLORS.textTertiary;
const ACCENT = COLORS.primary;
const COVER_H = 200;
const AVATAR_SIZE = 80;

const SLOTS = ['Morning (6–9 AM)', 'Late Morning (9–12 PM)', 'Afternoon (12–3 PM)', 'Late Afternoon (3–6 PM)', 'Evening (6–9 PM)'];

function initials(name: string) {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function fmt(n: number) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function StarRating({ value, size = 16, onSelect }: { value: number; size?: number; onSelect?: (n: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 3 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <TouchableOpacity key={n} onPress={() => onSelect?.(n)} disabled={!onSelect} activeOpacity={0.7}>
          <Ionicons name={n <= value ? 'star' : 'star-outline'} size={size} color={n <= value ? '#f39c12' : TEXT3} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function PostCard({ post, coachName, coachAvatar }: { post: CoachPost; coachName: string; coachAvatar?: string }) {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likes, setLikes] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    setLiked(l => !l);
    setLikes(n => liked ? n - 1 : n + 1);
    try {
      await api.likePost(post.id);
    } catch {
      setLiked(l => !l);
      setLikes(n => liked ? n + 1 : n - 1);
    }
  };

  return (
    <View style={p.card}>
      <View style={p.header}>
        <View style={p.avatar}>
          {coachAvatar
            ? <Image source={{ uri: coachAvatar }} style={p.avatarImg} />
            : <LinearGradient colors={[ACCENT, COLORS.primaryDark]} style={p.avatarImg}>
                <Text style={p.avatarText}>{initials(coachName)}</Text>
              </LinearGradient>
          }
        </View>
        <View style={{ flex: 1 }}>
          <Text style={p.authorName}>{coachName}</Text>
          <Text style={p.timestamp}>{timeAgo(post.timestamp)}</Text>
        </View>
      </View>

      {!!post.caption && <Text style={p.caption}>{post.caption}</Text>}

      {!!post.imageUrl && (
        <Image source={{ uri: post.imageUrl }} style={p.image} resizeMode="cover" />
      )}

      <View style={p.actions}>
        <TouchableOpacity style={p.action} onPress={handleLike} activeOpacity={0.7}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? ACCENT : TEXT2} />
          {likes > 0 && <Text style={[p.actionText, liked && { color: ACCENT }]}>{likes}</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={p.action} onPress={() => setShowComments(v => !v)} activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={18} color={TEXT2} />
          {post.comments > 0 && <Text style={p.actionText}>{post.comments}</Text>}
        </TouchableOpacity>
      </View>

      {showComments && (post.recentComments || []).length > 0 && (
        <View style={p.comments}>
          {(post.recentComments || []).map(c => (
            <View key={c.id} style={p.comment}>
              <Text style={p.commentName}>{c.userName}</Text>
              <Text style={p.commentText}>{c.content}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function ReviewCard({ review, onDelete }: { review: CoachReview; onDelete?: () => void }) {
  return (
    <View style={rv.card}>
      <View style={rv.header}>
        <View style={rv.avatar}>
          {review.userAvatar
            ? <Image source={{ uri: review.userAvatar }} style={rv.avatarImg} />
            : <View style={rv.avatarFallback}><Text style={rv.avatarText}>{review.userName[0]?.toUpperCase()}</Text></View>
          }
        </View>
        <View style={{ flex: 1 }}>
          <Text style={rv.name}>{review.userName}</Text>
          <StarRating value={review.rating} size={12} />
        </View>
        <Text style={rv.time}>{timeAgo(review.timestamp)}</Text>
        {review.isOwn && onDelete && (
          <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="trash-outline" size={15} color={TEXT3} />
          </TouchableOpacity>
        )}
      </View>
      {!!review.comment && <Text style={rv.comment}>{review.comment}</Text>}
    </View>
  );
}

export default function CoachProfileScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { trigger } = useHaptics();
  const { coachId } = route.params;
  const scrollY = useSharedValue(0);
  const followScale = useSharedValue(1);
  const msgY = useSharedValue(0);
  const msgOpacity = useSharedValue(1);

  const followAnimStyle = useAnimatedStyle(() => ({ transform: [{ scale: followScale.value }] }));
  const msgAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: msgY.value }],
    opacity: msgOpacity.value,
  }));

  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [bookVisible, setBookVisible] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [slot, setSlot] = useState('');
  const [goal, setGoal] = useState('');
  const [bookDate, setBookDate] = useState<Date>(new Date());
  const [bookSubmitting, setBookSubmitting] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getCoachProfile(coachId);
      setCoach(data);
      if (data.myReview) {
        setReviewRating(data.myReview.rating);
        setReviewComment(data.myReview.comment || '');
      }
    } catch {
      Alert.alert('Error', 'Failed to load coach profile');
    } finally {
      setLoading(false);
    }
  }, [coachId]);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  const onScroll = useAnimatedScrollHandler(e => { scrollY.value = e.contentOffset.y; });

  const coverParallax = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(scrollY.value, [0, COVER_H], [0, COVER_H * 0.4], Extrapolation.CLAMP) }],
  }));

  const navOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [COVER_H - 60, COVER_H], [0, 1], Extrapolation.CLAMP),
  }));

  const toggleFollow = async () => {
    if (!coach || followLoading) return;
    setFollowLoading(true);
    trigger('light');
    followScale.value = withSequence(
      withTiming(0.95, { duration: 120 }),
      withTiming(1, { duration: 250 })
    );
    try {
      if (coach.isFollowing) {
        await api.unfollowCoach(coach.id);
        setCoach(prev => prev ? { ...prev, isFollowing: false, followerCount: (prev.followerCount || 1) - 1 } : null);
      } else {
        await api.followCoach(coach.id);
        setCoach(prev => prev ? { ...prev, isFollowing: true, followerCount: (prev.followerCount || 0) + 1 } : null);
      }
    } catch {
      Alert.alert('Error', 'Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleMessage = async () => {
    if (!coach?.userId || msgLoading) return;
    setMsgLoading(true);
    trigger('medium');
    msgY.value = withSequence(
      withTiming(-6, { duration: 120 }),
      withTiming(0, { duration: 200 })
    );
    msgOpacity.value = withSequence(
      withTiming(0.4, { duration: 120 }),
      withTiming(1, { duration: 200 })
    );
    try {
      const { conversation } = await api.getOrCreateConversation(coach.userId);
      navigation.navigate('Conversation', {
        conversationId: conversation.id,
        recipientName: coach.name,
        recipientAvatar: coach.avatar,
      });
    } catch {
      Alert.alert('Error', 'Failed to open chat');
    } finally {
      setMsgLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!coach || !slot) return;
    setBookSubmitting(true);
    trigger('medium');
    try {
      await api.createBooking({ coachId: coach.id, date: bookDate.toISOString(), timeSlot: slot, goal });
      Alert.alert('Success', 'Booking request sent!');
      setBookVisible(false);
      setSlot('');
      setGoal('');
      setBookDate(new Date());
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to send booking request');
    } finally {
      setBookSubmitting(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!coach || reviewRating === 0) return;
    setReviewSubmitting(true);
    trigger('medium');
    try {
      const review = await api.submitCoachReview(coach.id, reviewRating, reviewComment || undefined);
      setCoach(prev => {
        if (!prev) return prev;
        const existing = prev.reviews?.find(r => r.isOwn);
        const reviews = existing
          ? (prev.reviews || []).map(r => r.isOwn ? review : r)
          : [review, ...(prev.reviews || [])];
        return { ...prev, reviews, myReview: review };
      });
      setReviewVisible(false);
    } catch {
      Alert.alert('Error', 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!coach) return;
    Alert.alert('Delete Review', 'Remove your review?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await api.deleteCoachReview(coach.id);
            setCoach(prev => prev ? {
              ...prev,
              reviews: (prev.reviews || []).filter(r => !r.isOwn),
              myReview: null,
            } : prev);
            setReviewRating(0);
            setReviewComment('');
          } catch {
            Alert.alert('Error', 'Failed to delete review');
          }
        }
      },
    ]);
  };

  if (loading) {
    return (
      <View style={s.center}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  if (!coach) {
    return (
      <View style={s.center}>
        <StatusBar barStyle="light-content" />
        <Text style={{ color: TEXT2 }}>Coach not found</Text>
      </View>
    );
  }

  const posts = coach.posts || [];
  const reviews = coach.reviews || [];

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={[s.floatNav, navOpacity]} pointerEvents="none">
        <BlurView intensity={80} tint="dark" style={s.floatNavBlur}>
          <Text style={s.floatNavTitle}>{coach.name}</Text>
        </BlurView>
      </Animated.View>

      <SafeAreaView style={s.backRow} edges={['top']}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <BlurView intensity={50} tint="dark" style={s.backBlur}>
            <Ionicons name="chevron-back" size={20} color={TEXT} />
          </BlurView>
        </TouchableOpacity>
      </SafeAreaView>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <Animated.View style={[s.cover, coverParallax]}>
          {coach.avatar ? (
            <Image source={{ uri: coach.avatar }} style={StyleSheet.absoluteFill} resizeMode="cover" />
          ) : (
            <LinearGradient colors={['#1c1c1e', '#111']} style={StyleSheet.absoluteFill} />
          )}
          <LinearGradient
            colors={['rgba(10,10,10,0)', 'rgba(10,10,10,0.5)', BG]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <View style={s.profileRow}>
          <View style={s.avatarWrap}>
            {coach.avatar ? (
              <Image source={{ uri: coach.avatar }} style={s.avatarImg} />
            ) : (
              <LinearGradient colors={[ACCENT, COLORS.primaryDark]} style={s.avatarFallback}>
                <Text style={s.avatarInitials}>{initials(coach.name)}</Text>
              </LinearGradient>
            )}
            {coach.verified && (
              <View style={s.verifiedBadge}>
                <Ionicons name="checkmark" size={10} color="#fff" />
              </View>
            )}
          </View>

          <View style={s.profileActions}>
            <TouchableOpacity style={s.bookBtn} onPress={() => setBookVisible(true)} activeOpacity={0.8}>
              <Text style={s.bookBtnText}>Book Session</Text>
            </TouchableOpacity>
            <Animated.View style={msgAnimStyle}>
              <TouchableOpacity style={s.iconBtn} onPress={handleMessage} disabled={msgLoading} activeOpacity={0.85}>
                {msgLoading
                  ? <ActivityIndicator size="small" color={TEXT} />
                  : <Ionicons name="chatbubble-outline" size={19} color={TEXT} />}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        <View style={s.body}>
          <Text style={s.name}>{coach.name}</Text>

          {coach.specialty.length > 0 && (
            <View style={s.specialtyRow}>
              {coach.specialty.slice(0, 3).map((sp, i) => (
                <Text key={i} style={s.specialty}>
                  {sp}{i < Math.min(coach.specialty.length, 3) - 1 ? '  ·  ' : ''}
                </Text>
              ))}
            </View>
          )}

          {!!coach.bio && <Text style={s.bio}>{coach.bio}</Text>}

          <View style={s.infoRow}>
            {!!coach.experience && (
              <View style={s.infoItem}>
                <Ionicons name="briefcase-outline" size={13} color={TEXT3} />
                <Text style={s.infoText}>{coach.experience} yrs experience</Text>
              </View>
            )}
            {!!coach.price && (
              <View style={s.infoItem}>
                <Ionicons name="cash-outline" size={13} color={TEXT3} />
                <Text style={s.infoText}>{coach.price}</Text>
              </View>
            )}
          </View>

          <Animated.View style={[{ alignSelf: 'flex-start' }, followAnimStyle]}>
            <TouchableOpacity
              style={[s.followBtn, coach.isFollowing && s.followingBtn, followLoading && { opacity: 0.6 }]}
              onPress={toggleFollow}
              disabled={followLoading}
              activeOpacity={0.9}
            >
              <Text style={[s.followBtnText, coach.isFollowing && s.followingBtnText]}>
                {coach.isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={s.divider} />

          <View style={s.statsRow}>
            {[
              { v: fmt(coach.followerCount || 0), l: 'Followers' },
              { v: fmt(coach.clientCount || 0), l: 'Clients' },
              { v: String(posts.length), l: 'Posts' },
              { v: coach.rating > 0 ? `${coach.rating}★` : '—', l: 'Rating' },
            ].map(st => (
              <View key={st.l} style={s.stat}>
                <Text style={s.statV}>{st.v}</Text>
                <Text style={s.statL}>{st.l}</Text>
              </View>
            ))}
          </View>

          <View style={s.divider} />

          {posts.length > 0 && (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Posts</Text>
              {posts.map(post => (
                <PostCard key={post.id} post={post} coachName={coach.name} coachAvatar={coach.avatar} />
              ))}
            </View>
          )}

          <View style={s.divider} />

          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>
                Reviews {reviews.length > 0 ? `(${reviews.length})` : ''}
              </Text>
              <TouchableOpacity onPress={() => setReviewVisible(true)} activeOpacity={0.7}>
                <Text style={s.writeReview}>
                  {coach.myReview ? 'Edit review' : 'Write a review'}
                </Text>
              </TouchableOpacity>
            </View>

            {reviews.length === 0 ? (
              <Text style={s.emptyText}>No reviews yet. Be the first!</Text>
            ) : (
              reviews.map(r => (
                <ReviewCard key={r.id} review={r} onDelete={r.isOwn ? handleDeleteReview : undefined} />
              ))
            )}
          </View>

          <View style={{ height: 60 }} />
        </View>
      </Animated.ScrollView>

      <Modal visible={bookVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setBookVisible(false)}>
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          <Text style={s.sheetTitle}>Book with {coach.name}</Text>
          <Animated.ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            <Text style={s.sectionLabel}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.dateRow}>
              {Array.from({ length: 365 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() + i);
                const isSelected = d.toDateString() === bookDate.toDateString();
                const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = d.getDate();
                const monthName = d.toLocaleDateString('en-US', { month: 'short' });
                return (
                  <TouchableOpacity
                    key={i}
                    style={[s.dateBtn, isSelected && s.dateBtnOn]}
                    onPress={() => setBookDate(d)}
                    activeOpacity={0.7}
                  >
                    <Text style={[s.dateBtnDay, isSelected && s.dateBtnDayOn]}>{dayName}</Text>
                    <Text style={[s.dateBtnNum, isSelected && s.dateBtnNumOn]}>{dayNum}</Text>
                    <Text style={[s.dateBtnMonth, isSelected && s.dateBtnDayOn]}>{monthName}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={[s.sectionLabel, { marginTop: 24 }]}>Select Time</Text>
            {SLOTS.map((sl, i) => (
              <Animated.View key={sl} entering={SlideInRight.delay(i * 40).duration(250)}>
                <TouchableOpacity
                  style={[s.slotBtn, slot === sl && s.slotBtnOn]}
                  onPress={() => setSlot(sl)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.slotText, slot === sl && s.slotTextOn]}>{sl}</Text>
                  {slot === sl && <Ionicons name="checkmark" size={16} color={ACCENT} />}
                </TouchableOpacity>
              </Animated.View>
            ))}

            <FadeIn delay={200}>
              <Text style={[s.sectionLabel, { marginTop: 24 }]}>Goal (optional)</Text>
              <TextInput
                style={s.sheetInput}
                placeholder="What do you want to work on?"
                placeholderTextColor={TEXT3}
                value={goal}
                onChangeText={setGoal}
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity
                style={[s.sheetBtn, (!slot || bookSubmitting) && { opacity: 0.4 }]}
                onPress={handleBooking}
                disabled={!slot || bookSubmitting}
                activeOpacity={0.8}
              >
                <LinearGradient colors={[ACCENT, COLORS.primaryDark]} style={s.sheetBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  {bookSubmitting
                    ? <ActivityIndicator size="small" color="#fff" />
                    : <Text style={s.sheetBtnText}>Request Session</Text>}
                </LinearGradient>
              </TouchableOpacity>
            </FadeIn>
          </Animated.ScrollView>
        </View>
      </Modal>

      <Modal visible={reviewVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setReviewVisible(false)}>
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          <Text style={s.sheetTitle}>{coach.myReview ? 'Edit Your Review' : `Review ${coach.name}`}</Text>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
            <Text style={s.sectionLabel}>Your Rating</Text>
            <View style={{ marginBottom: 24 }}>
              <StarRating value={reviewRating} size={32} onSelect={setReviewRating} />
            </View>

            <Text style={s.sectionLabel}>Comment (optional)</Text>
            <TextInput
              style={[s.sheetInput, { height: 110, textAlignVertical: 'top' }]}
              placeholder="Share your experience with this coach..."
              placeholderTextColor={TEXT3}
              value={reviewComment}
              onChangeText={setReviewComment}
              multiline
            />

            <TouchableOpacity
              style={[s.sheetBtn, (reviewRating === 0 || reviewSubmitting) && { opacity: 0.4 }, { marginTop: 20 }]}
              onPress={handleSubmitReview}
              disabled={reviewRating === 0 || reviewSubmitting}
              activeOpacity={0.8}
            >
              <LinearGradient colors={[ACCENT, COLORS.primaryDark]} style={s.sheetBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {reviewSubmitting
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <Text style={s.sheetBtnText}>{coach.myReview ? 'Update Review' : 'Submit Review'}</Text>}
              </LinearGradient>
            </TouchableOpacity>

            {coach.myReview && (
              <TouchableOpacity style={s.deleteReviewBtn} onPress={handleDeleteReview}>
                <Text style={s.deleteReviewText}>Delete my review</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: BG },

  floatNav: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 },
  floatNavBlur: {
    paddingTop: Platform.OS === 'ios' ? 52 : 16,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
    overflow: 'hidden',
  },
  floatNavTitle: { fontSize: 16, fontWeight: '700', color: TEXT },

  backRow: { position: 'absolute', top: 0, left: 0, zIndex: 101 },
  backBtn: { margin: 12 },
  backBlur: {
    width: 36, height: 36, borderRadius: 18,
    overflow: 'hidden', justifyContent: 'center', alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(255,255,255,0.15)',
  },

  cover: { height: COVER_H, width: SW, overflow: 'hidden' },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: -(AVATAR_SIZE / 2),
    marginBottom: 12,
  },
  avatarWrap: {
    width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden', borderWidth: 3, borderColor: BG,
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarFallback: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarInitials: { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  verifiedBadge: {
    position: 'absolute', bottom: 2, right: 2,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#3498db', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: BG,
  },

  profileActions: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 4 },
  bookBtn: { backgroundColor: ACCENT, borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8 },
  bookBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1, borderColor: BORDER,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: CARD,
  },

  body: { paddingHorizontal: 16 },

  name: { fontSize: 20, fontWeight: '800', color: TEXT, letterSpacing: -0.3, marginBottom: 2 },
  specialtyRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  specialty: { fontSize: 13, color: TEXT2, fontWeight: '500' },
  bio: { fontSize: 14, color: TEXT2, lineHeight: 21, marginBottom: 12 },

  infoRow: { flexDirection: 'row', gap: 16, marginBottom: 14 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  infoText: { fontSize: 12, color: TEXT3, fontWeight: '500' },

  followBtn: {
    borderRadius: 20,
    paddingHorizontal: 20, paddingVertical: 7,
    borderWidth: 1, borderColor: BORDER, marginBottom: 20,
  },
  followingBtn: { backgroundColor: 'transparent' },
  followBtnText: { fontSize: 14, fontWeight: '700', color: TEXT },
  followingBtnText: { color: TEXT2 },

  divider: { height: StyleSheet.hairlineWidth, backgroundColor: BORDER, marginVertical: 16 },

  statsRow: { flexDirection: 'row', marginBottom: 4 },
  stat: { flex: 1, alignItems: 'center' },
  statV: { fontSize: 17, fontWeight: '800', color: TEXT, marginBottom: 2 },
  statL: { fontSize: 12, color: TEXT3, fontWeight: '500' },

  section: { marginBottom: 4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: TEXT },
  writeReview: { fontSize: 13, fontWeight: '600', color: ACCENT },
  emptyText: { fontSize: 14, color: TEXT3, marginBottom: 8 },

  sheet: { flex: 1, backgroundColor: '#111', paddingTop: 16 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: BORDER, alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: TEXT, paddingHorizontal: 20, marginBottom: 24 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: TEXT3, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 },

  dateRow: { flexDirection: 'row', gap: 6, paddingBottom: 4 },
  dateBtn: { width: 52, alignItems: 'center', paddingVertical: 10, borderRadius: 10, backgroundColor: CARD, borderWidth: 1, borderColor: 'transparent' },
  dateBtnOn: { borderColor: ACCENT, backgroundColor: 'rgba(231,76,60,0.08)' },
  dateBtnDay: { fontSize: 11, color: TEXT3, fontWeight: '600', marginBottom: 5 },
  dateBtnDayOn: { color: ACCENT },
  dateBtnNum: { fontSize: 17, fontWeight: '800', color: TEXT2, marginBottom: 2 },
  dateBtnNumOn: { color: TEXT },
  dateBtnMonth: { fontSize: 10, color: TEXT3, fontWeight: '500' },

  slotBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: 12, backgroundColor: CARD,
    marginBottom: 6, borderWidth: 1, borderColor: 'transparent',
  },
  slotBtnOn: { borderColor: ACCENT, backgroundColor: 'rgba(231,76,60,0.05)' },
  slotText: { fontSize: 14, color: TEXT2, fontWeight: '500' },
  slotTextOn: { color: TEXT, fontWeight: '600' },

  sheetInput: {
    backgroundColor: CARD, borderRadius: 12, padding: 14,
    color: TEXT, borderWidth: 1, borderColor: BORDER, fontSize: 14,
  },
  sheetBtn: { borderRadius: 14, overflow: 'hidden' },
  sheetBtnGrad: { paddingVertical: 15, alignItems: 'center' },
  sheetBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  deleteReviewBtn: { marginTop: 16, alignItems: 'center', paddingVertical: 12 },
  deleteReviewText: { fontSize: 14, color: TEXT3, fontWeight: '500' },
});

const p = StyleSheet.create({
  card: { marginBottom: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER, paddingBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  authorName: { fontSize: 14, fontWeight: '700', color: TEXT, marginBottom: 1 },
  timestamp: { fontSize: 11, color: TEXT3 },
  caption: { fontSize: 14, color: TEXT, lineHeight: 20, marginBottom: 10 },
  image: { width: '100%', height: SW * 0.65, borderRadius: 10, marginBottom: 10 },
  actions: { flexDirection: 'row', gap: 16 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionText: { fontSize: 13, color: TEXT2, fontWeight: '500' },
  comments: { marginTop: 10, gap: 6 },
  comment: { flexDirection: 'row', gap: 6 },
  commentName: { fontSize: 13, fontWeight: '700', color: TEXT },
  commentText: { fontSize: 13, color: TEXT2, flex: 1 },
});

const rv = StyleSheet.create({
  card: { marginBottom: 14, paddingBottom: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  avatar: { width: 32, height: 32, borderRadius: 16, overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%' },
  avatarFallback: { width: '100%', height: '100%', backgroundColor: CARD, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 13, fontWeight: '700', color: TEXT2 },
  name: { fontSize: 13, fontWeight: '700', color: TEXT, marginBottom: 3 },
  time: { fontSize: 11, color: TEXT3, marginRight: 6 },
  comment: { fontSize: 13, color: TEXT2, lineHeight: 19 },
});
