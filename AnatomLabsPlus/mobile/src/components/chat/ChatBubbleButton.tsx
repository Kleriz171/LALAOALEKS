import React, { useState, useCallback } from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, SHADOWS } from '../animations';
import ChatOverlay from './ChatOverlay';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function ChatBubbleButton() {
  const [chatVisible, setChatVisible] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0.85, { damping: 15, stiffness: 300 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    }, 100);
    setChatVisible(prev => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setChatVisible(false);
  }, []);

  return (
    <>
      <AnimatedTouchable
        style={[styles.button, animatedStyle, SHADOWS.glow(COLORS.primary)]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Ionicons
          name={chatVisible ? 'close' : 'chatbubble-ellipses'}
          size={26}
          color="#fff"
        />
      </AnimatedTouchable>
      <ChatOverlay visible={chatVisible} onClose={handleClose} />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 20,
    bottom: Platform.OS === 'ios' ? 100 : 75,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
});
