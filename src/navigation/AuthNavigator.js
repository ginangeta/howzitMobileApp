// src/navigation/AuthNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import UnifiedAuthScreen from '../screens/auth/UnifiedAuthScreen';

import CustomerHome from '../screens/customer/CustomerHome';
import CelebrityList from '../screens/customer/CelebrityList';
import CelebrityProfile from '../screens/customer/CelebrityProfile';
import ShoutoutRequest from '../screens/customer/ShoutoutRequest';
import StatusTracker from '../screens/customer/StatusTracker';
import DepositPage from '../screens/customer/DepositPage';

import CelebritySetup from '../screens/celebrity/CelebritySetup';
import CelebrityDashboard from '../screens/celebrity/CelebrityDashboard';
import RequestDetails from '../screens/celebrity/RequestDetails';
import Withdraw from '../screens/celebrity/Withdraw';

import { useLogin } from '../context/LoginContext';
import CustomerTabs from './CustomerTabs';
import CelebrityTabs from './CelebrityTabs';
import AuthFormScreen from '../screens/auth/AuthFormScreen';
import UserTypeSelectionScreen from '../screens/auth/UserTypeSelectionScreen';
import OTPScreen from '../screens/auth/OTPScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  const { isLoggedIn, userType } = useLogin();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="UnifiedLogin" component={UnifiedAuthScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />
          <Stack.Screen name="AuthForm" component={AuthFormScreen} />
          <Stack.Screen name="UserTypeSelection" component={UserTypeSelectionScreen} />
        </>
      ) : userType === 'customer' ? (
        <>
          <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
          <Stack.Screen name="CustomerHome" component={CustomerHome} />
          <Stack.Screen name="CelebrityList" component={CelebrityList} />
          <Stack.Screen name="CelebrityProfile" component={CelebrityProfile} />
          <Stack.Screen name="ShoutoutRequest" component={ShoutoutRequest} />
          <Stack.Screen name="StatusTracker" component={StatusTracker} />
          <Stack.Screen name="Deposit" component={DepositPage} />
        </>
      ) : (
        <>
          <Stack.Screen name="CelebrityTabs" component={CelebrityTabs} />
          <Stack.Screen name="CelebritySetup" component={CelebritySetup} />
          <Stack.Screen name="CelebrityDashboard" component={CelebrityDashboard} />
          <Stack.Screen name="RequestDetails" component={RequestDetails} />
          <Stack.Screen name="Withdraw" component={Withdraw} />
        </>
      )}
    </Stack.Navigator>
  );
}
