import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/tabs/HomeScreen';
import CoachMarketplaceScreen from '../screens/tabs/CoachMarketplaceScreen';
import NutritionScreen from '../screens/tabs/NutritionScreen';
import WorkoutsScreen from '../screens/tabs/WorkoutsScreen';
import ReportsScreen from '../screens/tabs/ReportsScreen';
import NutritionTrackingScreen from '../screens/tabs/NutritionTrackingScreen';
import WorkoutTrackingScreen from '../screens/tabs/WorkoutTrackingScreen';
import BarcodeScannerScreen from '../screens/scanner/BarcodeScannerScreen';
import ScannedFoodDetailsScreen from '../screens/scanner/ScannedFoodDetailsScreen';
import ManualFoodEntryScreen from '../screens/scanner/ManualFoodEntryScreen';
import FoodScannerScreen from '../screens/scanner/FoodScannerScreen';
import AnatomyExplorerScreen from '../screens/tabs/AnatomyExplorerScreen';
import HealthProfileScreen from '../screens/tabs/HealthProfileScreen';
import ConversationsListScreen from '../screens/messaging/ConversationsListScreen';
import ConversationScreen from '../screens/messaging/ConversationScreen';
import CoachDashboardScreen from '../screens/coach/CoachDashboardScreen';
import CoachProfileScreen from '../screens/coach/CoachProfileScreen';
import CoachApplicationStatusScreen from '../screens/coach/CoachApplicationStatusScreen';
import BookingsScreen from '../screens/bookings/BookingsScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import NewAdminDashboardScreen from '../screens/admin/NewAdminDashboardScreen';

import NotificationsScreen from '../screens/tabs/NotificationsScreen';
import FollowerListScreen from '../screens/tabs/FollowerListScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

type TabIconName = 'home' | 'people' | 'nutrition' | 'barbell' | 'analytics';

const tabIcons: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: 'home', inactive: 'home-outline' },
  Coaches: { active: 'people', inactive: 'people-outline' },
  Nutrition: { active: 'nutrition', inactive: 'nutrition-outline' },
  Workouts: { active: 'barbell', inactive: 'barbell-outline' },
  Reports: { active: 'analytics', inactive: 'analytics-outline' },
};

function AnimatedTabIcon({ name, focused, color, size }: { name: string; focused: boolean; color: string; size: number }) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.15, { damping: 10, stiffness: 200 });
    } else {
      scale.value = withSpring(1, { damping: 15, stiffness: 200 });
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const icons = tabIcons[name] || { active: 'help-circle', inactive: 'help-circle-outline' };
  const iconName = focused ? icons.active : icons.inactive;

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={iconName} size={size} color={color} />
    </Animated.View>
  );
}

function TabNavigator() {
  const insets = useSafeAreaInsets();
  const androidBottomPadding = Math.max(insets.bottom, 8);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        lazy: false,
        tabBarIcon: ({ focused, color, size }) => (
          <AnimatedTabIcon name={route.name} focused={focused} color={color} size={size} />
        ),
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(10, 10, 10, 0.95)',
          borderTopColor: 'rgba(51, 51, 51, 0.5)',
          borderTopWidth: StyleSheet.hairlineWidth,
          paddingBottom: Platform.OS === 'ios' ? 20 : androidBottomPadding,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 85 : 52 + androidBottomPadding,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={80}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingTop: 4,
        },
      })}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Coaches"
        component={CoachMarketplaceScreen}
        options={{
          tabBarLabel: 'Coaches',
        }}
      />
      <Tab.Screen
        name="Nutrition"
        component={NutritionScreen}
        options={{
          tabBarLabel: 'Nutrition',
        }}
      />
      <Tab.Screen
        name="Workouts"
        component={WorkoutsScreen}
        options={{
          tabBarLabel: 'Workouts',
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{
          tabBarLabel: 'Reports',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, user } = useAuth();

  const isLoggedIn = isAuthenticated === true;
  const isAdmin = isLoggedIn && user?.isAdmin === true;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 300,
        }}
      >
        {isAdmin ? (
          <Stack.Screen
            name="AdminDashboard"
            component={NewAdminDashboardScreen}
            options={{ animation: 'fade', animationDuration: 400 }}
          />
        ) : isLoggedIn ? (
          <>
            <Stack.Screen
              name="Main"
              component={TabNavigator}
              options={{
                animation: 'fade',
                animationDuration: 400,
              }}
            />
            <Stack.Screen name="NutritionTracking" component={NutritionTrackingScreen} />
            <Stack.Screen name="WorkoutTracking" component={WorkoutTrackingScreen} />
            <Stack.Screen
              name="BarcodeScanner"
              component={BarcodeScannerScreen}
              options={{
                animation: 'slide_from_bottom',
                presentation: 'fullScreenModal',
              }}
            />
            <Stack.Screen name="ScannedFoodDetails" component={ScannedFoodDetailsScreen} />
            <Stack.Screen name="ManualFoodEntry" component={ManualFoodEntryScreen} />
            <Stack.Screen
              name="FoodScanner"
              component={FoodScannerScreen}
              options={{
                animation: 'slide_from_bottom',
                presentation: 'fullScreenModal',
              }}
            />
            <Stack.Screen
              name="AnatomyExplorer"
              component={AnatomyExplorerScreen}
              options={{
                animation: 'slide_from_bottom',
                presentation: 'fullScreenModal',
              }}
            />
            <Stack.Screen name="HealthProfile" component={HealthProfileScreen} />
            <Stack.Screen name="Conversations" component={ConversationsListScreen} />
            <Stack.Screen name="Conversation" component={ConversationScreen} />
            <Stack.Screen name="CoachDashboard" component={CoachDashboardScreen} />
            <Stack.Screen name="CoachProfile" component={CoachProfileScreen} />
            <Stack.Screen name="CoachApplicationStatus" component={CoachApplicationStatusScreen} />
            <Stack.Screen name="Bookings" component={BookingsScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="FollowerList" component={FollowerListScreen} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                animation: 'fade',
                animationDuration: 400,
              }}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
