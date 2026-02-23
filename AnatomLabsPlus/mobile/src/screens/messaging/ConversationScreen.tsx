import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';
import { ChatMessage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { COLORS, FadeIn, AnimatedListItem } from '../../components/animations';

function getInitials(name: string): string {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function AnimatedBubble({ children }: { children: React.ReactNode }) {
  const translateY = useSharedValue(14);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 280, easing: Easing.out(Easing.exp) });
    opacity.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) });
    scale.value = withSpring(1, { damping: 18, stiffness: 260 });
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

export default function ConversationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuth();
  const { conversationId, recipientName, recipientAvatar } = route.params;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const loadMessages = useCallback(async () => {
    try {
      const data = await api.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    loadMessages();
    api.markConversationRead(conversationId).catch(() => {});
    pollRef.current = setInterval(loadMessages, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loadMessages, conversationId]);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    const content = text.trim();
    setText('');
    setSending(true);
    try {
      const message = await api.sendMessage(conversationId, content);
      setMessages(prev => [...prev, message]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      console.error('Failed to send message:', error);
      setText(content); // Restore text on failure
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => {
    const isMine = item.senderId === user?.id;
    const showAvatar = !isMine && (index === 0 || messages[index - 1].senderId !== item.senderId);
    const isNewest = index === messages.length - 1;

    const content = (
      <View style={[styles.messageRow, isMine ? styles.myRow : styles.theirRow]}>
        {!isMine && (
          <View style={styles.avatarSpace}>
            {showAvatar && (
              recipientAvatar ? (
                <Image source={{ uri: recipientAvatar }} style={styles.bubbleAvatar} />
              ) : (
                <View style={[styles.bubbleAvatar, styles.initialsAvatar]}>
                  <Text style={styles.bubbleAvatarText}>{getInitials(recipientName)}</Text>
                </View>
              )
            )}
          </View>
        )}
        <View style={[styles.bubbleContainer, isMine ? styles.myContainer : styles.theirContainer]}>
          <View style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}>
            <Text style={[styles.messageText, isMine && styles.myMessageText]}>{item.content}</Text>
          </View>
          <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
        </View>
      </View>
    );

    if (isMine && isNewest) {
      return <AnimatedBubble key={item.id}>{content}</AnimatedBubble>;
    }

    return content;
  };

  if (loading && messages.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            {recipientAvatar ? (
              <Image source={{ uri: recipientAvatar }} style={styles.headerAvatar} />
            ) : (
              <View style={[styles.headerAvatar, styles.initialsAvatar]}>
                <Text style={styles.headerAvatarText}>{getInitials(recipientName)}</Text>
              </View>
            )}
            <Text style={styles.headerName}>{recipientName}</Text>
          </View>
          
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="ellipsis-horizontal" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputArea}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Message..."
              placeholderTextColor={COLORS.textTertiary}
              value={text}
              onChangeText={setText}
              multiline
              maxLength={2000}
            />
            <TouchableOpacity
              style={[styles.sendBtn, (!text.trim() || sending) && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={!text.trim() || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="arrow-up" size={22} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  headerBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  headerAvatarText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 24,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  myRow: {
    justifyContent: 'flex-end',
  },
  theirRow: {
    justifyContent: 'flex-start',
  },
  avatarSpace: {
    width: 32,
    justifyContent: 'flex-end',
  },
  bubbleAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  initialsAvatar: {
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bubbleAvatarText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  bubbleContainer: {
    maxWidth: '80%',
  },
  myContainer: {
    alignItems: 'flex-end',
  },
  theirContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: COLORS.cardBackground,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.text,
  },
  myMessageText: {
    color: '#fff',
  },
  timeText: {
    fontSize: 10,
    color: COLORS.textTertiary,
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputArea: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 8 : 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 15,
    color: COLORS.text,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  sendBtnDisabled: {
    backgroundColor: COLORS.textTertiary,
    opacity: 0.5,
  },
});
