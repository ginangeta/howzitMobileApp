// src/navigation/CustomerTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import CustomerHome from '../screens/customer/CustomerHome';
import WalletScreen from '../screens/customer/WalletScreen';
import FollowingScreen from '../screens/customer/FollowingScreen';
import RequestList from '../screens/customer/RequestList';

import { useAppTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();
const { height } = Dimensions.get('window');

export default function CustomerTabs() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Requests') iconName = 'list-outline';
          else if (route.name === 'Following') iconName = 'heart-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted ?? '#9CA3AF',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: Platform.OS === 'ios' ? insets.bottom + height * 0.08 : height * 0.08,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 6,
          borderTopWidth: 0,
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: height < 700 ? 10 : 12,
        },
      })}
    >
      <Tab.Screen name="Home" component={CustomerHome} />
      <Tab.Screen name="Requests" component={RequestList} />
      <Tab.Screen name="Following" component={FollowingScreen} />
      <Tab.Screen name="Profile" component={WalletScreen} />
    </Tab.Navigator>
  );
}
