import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CelebrityHome from '../screens/celebrity/CelebrityDashboard';
import Profile from '../screens/celebrity/Profile'; // Updated to match file
import Earnings from '../screens/celebrity/Earnings'; // Updated to match file
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';

const Tab = createBottomTabNavigator();

export default function CelebrityTabs({ route }) {
  // const { celebProfile } = route.params;

  const celebProfile = {
    name: 'Gina Wambui',
    bio: 'Lorem Ipsum',
    acceptedTypes: ['text', 'video', 'audio'],
    deliveryTime: 3,
    price: parseFloat(100),
    avatar: 'https://i.pravatar.cc/100?img=4', // Placeholder avatar
    shoutoutsDone: 124,
    rating: 4.8,
    balance: parseFloat(200),  // <-- Add balance here (USD for example)
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
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 6,
        },
      })}
    >
      <Tab.Screen name="Home" component={CelebrityHome} initialParams={{ celebProfile }} />
      <Tab.Screen name="Earnings" component={Earnings} initialParams={{ celebProfile }} />
      <Tab.Screen name="Profile" component={Profile} initialParams={{ celebProfile }} />
    </Tab.Navigator>
  );
}
