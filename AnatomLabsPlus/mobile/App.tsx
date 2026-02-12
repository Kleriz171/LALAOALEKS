import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { NutritionProvider } from './src/context/NutritionContext';
import { WorkoutTrackingProvider } from './src/context/WorkoutTrackingContext';
import AppNavigator from './src/navigation/AppNavigator';
import ChatBubbleButton from './src/components/chat/ChatBubbleButton';

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
