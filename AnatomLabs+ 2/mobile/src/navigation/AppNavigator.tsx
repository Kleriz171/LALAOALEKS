import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/tabs/HomeScreen';
import BodyExplorerScreen from '../screens/tabs/BodyExplorerScreen';
import NutritionScreen from '../screens/tabs/NutritionScreen';
import WorkoutsScreen from '../screens/tabs/WorkoutsScreen';
import ReportsScreen from '../screens/tabs/ReportsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        lazy: false,
        tabBarStyle: {
          backgroundColor: '#0a0a0a',
          borderTopColor: '#333',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor: '#e74c3c',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
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
        name="BodyExplorer"
        component={BodyExplorerScreen}
        options={{
          tabBarLabel: 'Anatomy',
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
  const { isAuthenticated } = useAuth();

  // Ensure strict boolean for Fabric renderer compatibility
  const isLoggedIn = isAuthenticated === true;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
