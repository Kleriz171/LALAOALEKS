import React from 'react';
import { View, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { NutritionProvider } from './src/context/NutritionContext';
import { WorkoutTrackingProvider } from './src/context/WorkoutTrackingContext';
import AppNavigator from './src/navigation/AppNavigator';
import ChatBubbleButton from './src/components/chat/ChatBubbleButton';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather, AntDesign } from '@expo/vector-icons';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <View style={{ flex: 1 }}>
      <AppNavigator />
      {isAuthenticated === true && <ChatBubbleButton />}
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    ...MaterialCommunityIcons.font,
    ...FontAwesome5.font,
    ...Feather.font,
    ...AntDesign.font,
  });

  if (Platform.OS === 'web' && !fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NutritionProvider>
            <WorkoutTrackingProvider>
              <AppContent />
            </WorkoutTrackingProvider>
          </NutritionProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
