import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomerHome from '../screens/customer/CustomerHome';
import WalletScreen from '../screens/customer/WalletScreen';
import FollowingScreen from '../screens/customer/FollowingScreen';
import RequestList from '../screens/customer/RequestList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../constants/Colors';

const Tab = createBottomTabNavigator();

export default function CustomerTabs() {
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
      <Tab.Screen name="Home" component={CustomerHome} />
      <Tab.Screen name="Requests" component={RequestList} />
      <Tab.Screen name="Following" component={FollowingScreen} />
      <Tab.Screen name="Profile" component={WalletScreen} />
    </Tab.Navigator>
  );
}
