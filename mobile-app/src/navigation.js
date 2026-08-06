import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CustomerHomeScreen from './screens/CustomerHomeScreen';
import BookingsScreen from './screens/BookingsScreen';
import MessagesScreen from './screens/MessagesScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import ProviderHomeScreen from './screens/ProviderHomeScreen';
import ProviderBookingsScreen from './screens/ProviderBookingsScreen';
import ProviderProfileScreen from './screens/ProviderProfileScreen';

const Stack = createNativeStackNavigator();
const CustomerTabs = createBottomTabNavigator();
const ProviderTabs = createBottomTabNavigator();

function CustomerTabsNavigator() {
  return (
    <CustomerTabs.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Home: 'home',
          Bookings: 'calendar-today',
          Chat: 'chat-bubble-outline',
          Notifications: 'notifications-none',
          Favorites: 'favorite-border',
        };
        return <MaterialIcons name={icons[route.name]} size={size} color={color} />;
      },
    })}>
      <CustomerTabs.Screen name="Home" component={CustomerHomeScreen} />
      <CustomerTabs.Screen name="Bookings" component={BookingsScreen} />
      <CustomerTabs.Screen name="Chat" component={MessagesScreen} />
      <CustomerTabs.Screen name="Notifications" component={NotificationsScreen} />
      <CustomerTabs.Screen name="Favorites" component={FavoritesScreen} />
    </CustomerTabs.Navigator>
  );
}

function ProviderTabsNavigator() {
  return (
    <ProviderTabs.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Home: 'home',
          Bookings: 'calendar-today',
          Messages: 'chat-bubble-outline',
          Profile: 'person-outline',
        };
        return <MaterialIcons name={icons[route.name]} size={size} color={color} />;
      },
    })}>
      <ProviderTabs.Screen name="Home" component={ProviderHomeScreen} />
      <ProviderTabs.Screen name="Bookings" component={ProviderBookingsScreen} />
      <ProviderTabs.Screen name="Messages" component={MessagesScreen} />
      <ProviderTabs.Screen name="Profile" component={ProviderProfileScreen} />
    </ProviderTabs.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="CustomerTabs" component={CustomerTabsNavigator} />
        <Stack.Screen name="ProviderTabs" component={ProviderTabsNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
