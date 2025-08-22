import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions, Platform } from 'react-native';
import CelebrityHome from '../screens/celebrity/CelebrityDashboard';
import Profile from '../screens/celebrity/Profile';
import Earnings from '../screens/celebrity/Earnings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';

const Tab = createBottomTabNavigator();
const { height } = Dimensions.get('window');

export default function CelebrityTabs({ route }) {
  const insets = useSafeAreaInsets();

  // Sample profile for testing
  const celebProfile = {
    name: 'Sample User',
    bio: 'Lorem Ipsum',
    acceptedTypes: ['text', 'video', 'audio'],
    deliveryTime: 3,
    price: parseFloat(100),
    avatar: 'https://i.pravatar.cc/100?img=4',
    shoutoutsDone: 124,
    rating: 4.8,
    balance: parseFloat(200),
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Earnings') iconName = 'wallet-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: Platform.OS === 'ios'
            ? insets.bottom + height * 0.08
            : height * 0.08,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 6,
        },
        tabBarLabelStyle: {
          fontSize: height < 700 ? 10 : 12,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={CelebrityHome}
        initialParams={{ celebProfile }}
      />
      <Tab.Screen
        name="Earnings"
        component={Earnings}
        initialParams={{ celebProfile }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        initialParams={{ celebProfile }}
      />
    </Tab.Navigator>
  );
}
