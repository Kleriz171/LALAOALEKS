import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
  FadeIn,
  FadeInUp,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../animations';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const OVERLAY_HEIGHT = SCREEN_HEIGHT * 0.82;
const ANIM_DURATION = 300;
const ANIM_EASING = Easing.bezier(0.32, 0.72, 0, 1);

type CharacterType = 'drill_sergeant' | 'zen_coach' | 'hype_coach';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  isSystem?: boolean;
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

const CHARACTERS: { type: CharacterType; name: string; icon: keyof typeof Ionicons.glyphMap; description: string }[] = [
  { type: 'drill_sergeant', name: 'Drill Sergeant', icon: 'shield', description: "No excuses. I'll push you to your limits." },
  { type: 'zen_coach', name: 'Zen Coach', icon: 'leaf', description: 'Balance, mindfulness, and steady progress.' },
  { type: 'hype_coach', name: 'Hype Coach', icon: 'flame', description: "LET'S GO! Every rep counts, champion!" },
];

const AnimatedView = Animated.View;
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function TypingDots() {
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    const animate = () => {
      dot1.value = withTiming(1, { duration: 400 });
      setTimeout(() => { dot2.value = withTiming(1, { duration: 400 }); }, 200);
      setTimeout(() => { dot3.value = withTiming(1, { duration: 400 }); }, 400);
      setTimeout(() => {
        dot1.value = withTiming(0.3, { duration: 400 });
        dot2.value = withTiming(0.3, { duration: 400 });
        dot3.value = withTiming(0.3, { duration: 400 });
      }, 800);
    };
    animate();
    const interval = setInterval(animate, 1200);
    return () => clearInterval(interval);
  }, []);

  const style1 = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const style2 = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const style3 = useAnimatedStyle(() => ({ opacity: dot3.value }));

  return (
    <AnimatedView entering={FadeIn.duration(200)} style={styles.typingContainer}>
      <View style={styles.aiAvatar}>
        <Ionicons name="fitness" size={14} color={COLORS.primary} />
      </View>
      <View style={styles.typingBubble}>
        <AnimatedView style={[styles.typingDot, style1]} />
        <AnimatedView style={[styles.typingDot, style2]} />
        <AnimatedView style={[styles.typingDot, style3]} />
      </View>
    </AnimatedView>
  );
}

function MessageBubble({ item }: { item: Message }) {
  const isUser = item.role === 'user';
  return (
    <AnimatedView
      entering={FadeIn.duration(200)}
      style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}
    >
      {!isUser && (
        <View style={styles.aiAvatar}>
          <Ionicons name="fitness" size={14} color={COLORS.primary} />
        </View>
      )}
      <View style={[styles.messageContent, isUser ? styles.userContent : styles.aiContent]}>
        <Text style={[styles.messageText, isUser && styles.userMessageText]}>{item.content}</Text>
      </View>
    </AnimatedView>
  );
}

export default function ChatOverlay({ visible, onClose }: Props) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [character, setCharacter] = useState<CharacterType>('hype_coach');
  const [showCharacterPicker, setShowCharacterPicker] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [mounted, setMounted] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);

  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.value = withTiming(1, { duration: ANIM_DURATION, easing: ANIM_EASING });
    } else {
      progress.value = withTiming(0, { duration: 250, easing: ANIM_EASING }, () => {
        runOnJS(setMounted)(false);
      });
    }
  }, [visible]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (visible && messages.length === 0) {
      const name = user?.name?.split(' ')[0] || 'there';
      setMessages([{
        id: 'welcome',
        role: 'model',
        content: `Hey ${name}! I'm your AnatomLabs fitness assistant. Ask me anything about training, nutrition, or your health. Type /character to customize my personality!`,
        isSystem: true,
      }]);
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.value, [0, 1], [OVERLAY_HEIGHT, 0]) }],
  }));

  const getHistory = useCallback((): { role: string; content: string }[] => {
    return messages
      .filter(m => !m.isSystem)
      .map(m => ({ role: m.role, content: m.content }));
  }, [messages]);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, []);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInputText('');

    if (text.toLowerCase() === '/character') {
      setShowCharacterPicker(true);
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    scrollToEnd();

    try {
      const history = getHistory();
      const result = await api.sendChatMessage(text, character, history);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: result.response,
      };
      setMessages(prev => [...prev, aiMsg]);
      scrollToEnd();
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "Sorry, I couldn't process that. Please try again.",
        isSystem: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading, character, getHistory, scrollToEnd]);

  const selectCharacter = useCallback((type: CharacterType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCharacter(type);
    setShowCharacterPicker(false);
    const charName = CHARACTERS.find(c => c.type === type)?.name || type;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'model',
      content: `Character switched to ${charName}!`,
      isSystem: true,
    }]);
  }, []);

  const renderMessage = useCallback(({ item }: { item: Message }) => (
    <MessageBubble item={item} />
  ), []);

  if (!mounted) return null;

  const bottomPadding = keyboardHeight > 0 ? keyboardHeight : (insets.bottom || 16);

  return (
    <View style={styles.fullScreen} pointerEvents="box-none">
      <AnimatedView style={[styles.backdropFill, backdropStyle]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
      </AnimatedView>

      <AnimatedView style={[styles.containerWrapper, containerStyle]}>
        <View style={[styles.container, { paddingBottom: bottomPadding }]}>
          <View style={styles.header}>
            <View style={styles.headerHandle} />
            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIcon}>
                  <Ionicons name="fitness" size={18} color={COLORS.primary} />
                </View>
                <View>
                  <Text style={styles.headerTitle}>AnatomLabs AI</Text>
                  <Text style={styles.headerSubtitle}>
                    {CHARACTERS.find(c => c.type === character)?.name || 'Hype Coach'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {showCharacterPicker ? (
            <View style={styles.characterPickerContainer}>
              <Text style={styles.characterPickerTitle}>Choose Your Coach</Text>
              {CHARACTERS.map((char, index) => (
                <AnimatedTouchable
                  key={char.type}
                  entering={FadeInUp.delay(index * 60).duration(250)}
                  style={[styles.characterCard, character === char.type && styles.characterCardActive]}
                  onPress={() => selectCharacter(char.type)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.characterIcon, character === char.type && styles.characterIconActive]}>
                    <Ionicons name={char.icon} size={24} color={character === char.type ? '#fff' : COLORS.textSecondary} />
                  </View>
                  <View style={styles.characterInfo}>
                    <Text style={[styles.characterName, character === char.type && styles.characterNameActive]}>{char.name}</Text>
                    <Text style={styles.characterDescription}>{char.description}</Text>
                  </View>
                  {character === char.type && (
                    <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
                  )}
                </AnimatedTouchable>
              ))}
              <TouchableOpacity style={styles.characterDismiss} onPress={() => setShowCharacterPicker(false)}>
                <Text style={styles.characterDismissText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.messagesList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              ListFooterComponent={isLoading ? <TypingDots /> : null}
            />
          )}

          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Ask about fitness, nutrition..."
              placeholderTextColor={COLORS.textTertiary}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
            >
              <Ionicons name="send" size={18} color={inputText.trim() && !isLoading ? '#fff' : COLORS.textTertiary} />
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdropFill: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  containerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: OVERLAY_HEIGHT,
  },
  container: {
    flex: 1,
    backgroundColor: '#111',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  headerHandle: {
    width: 36,
    height: 4,
    backgroundColor: COLORS.textTertiary,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexGrow: 1,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  aiBubble: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageContent: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userContent: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  aiContent: {
    backgroundColor: COLORS.cardBackground,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 21,
  },
  userMessageText: {
    color: '#fff',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    marginTop: 4,
  },
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 6,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    color: COLORS.text,
    fontSize: 15,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.cardBackground,
  },
  characterPickerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  characterPickerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  characterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  characterCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(231, 76, 60, 0.08)',
  },
  characterIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.cardBackgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  characterIconActive: {
    backgroundColor: COLORS.primary,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 3,
  },
  characterNameActive: {
    color: COLORS.primary,
  },
  characterDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  characterDismiss: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  characterDismissText: {
    color: COLORS.textSecondary,
    fontSize: 15,
  },
});
