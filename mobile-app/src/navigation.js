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
import SearchScreen from './screens/SearchScreen';
import ProfileScreen from './screens/ProfileScreen';
import ClientAlertScreen from './screens/ClientAlertScreen';
import ClientSettingsScreen from './screens/ClientSettingsScreen';
import ClientHelpCenterScreen from './screens/ClientHelpCenterScreen';
import ClientHelpSupportScreen from './screens/ClientHelpSupportScreen';
import ProviderHomeScreen from './screens/ProviderHomeScreen';
import ProviderBookingsScreen from './screens/ProviderBookingsScreen';
import ProviderProfileScreen from './screens/ProviderProfileScreen';
import ProviderServicePricingScreen from './screens/ProviderServicePricingScreen';
import ProviderAvailabilityScreen from './screens/ProviderAvailabilityScreen';
import ProviderCurrentJobsScreen from './screens/ProviderCurrentJobsScreen';
import ProviderCompletedJobsScreen from './screens/ProviderCompletedJobsScreen';
import ProviderReviewsScreen from './screens/ProviderReviewsScreen';
import ProviderEarningsScreen from './screens/ProviderEarningsScreen';
import ProviderVerificationScreen from './screens/ProviderVerificationScreen';
import ProviderSettingsScreen from './screens/ProviderSettingsScreen';
import ProviderHelpCenterScreen from './screens/ProviderHelpCenterScreen';
import ProviderHelpSupportScreen from './screens/ProviderHelpSupportScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import SearchResultsScreen from './screens/SearchResultsScreen';
import ProviderDetailsScreen from './screens/ProviderDetailsScreen';
import BookServiceScreen from './screens/BookServiceScreen';
import PaymentScreen from './screens/PaymentScreen';
import BookingConfirmedScreen from './screens/BookingConfirmedScreen';
import ReviewScreen from './screens/ReviewScreen';

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
          Search: 'search',
          Bookings: 'calendar-today',
          Chat: 'chat-bubble-outline',
          Notifications: 'notifications-none',
          Favorites: 'favorite-border',
          Profile: 'person-outline',
        };
        return <MaterialIcons name={icons[route.name]} size={size} color={color} />;
      },
    })}>
      <CustomerTabs.Screen name="Home" component={CustomerHomeScreen} />
      <CustomerTabs.Screen name="Search" component={SearchScreen} />
      <CustomerTabs.Screen name="Bookings" component={BookingsScreen} />
      <CustomerTabs.Screen name="Chat" component={MessagesScreen} />
      <CustomerTabs.Screen name="Notifications" component={NotificationsScreen} />
      <CustomerTabs.Screen name="Favorites" component={FavoritesScreen} />
      <CustomerTabs.Screen name="Profile" component={ProfileScreen} />
    </CustomerTabs.Navigator>
  );
}

function ProviderTabsNavigator() {
  return (
    <ProviderTabs.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Dashboard: 'dashboard',
          Requests: 'assignment',
          CurrentJobs: 'work-outline',
          Messages: 'chat-bubble-outline',
          Profile: 'person-outline',
        };
        return <MaterialIcons name={icons[route.name]} size={size} color={color} />;
      },
    })}>
      <ProviderTabs.Screen name="Dashboard" component={ProviderHomeScreen} />
      <ProviderTabs.Screen name="Requests" component={ProviderBookingsScreen} />
      <ProviderTabs.Screen name="CurrentJobs" component={ProviderCurrentJobsScreen} />
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
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
        <Stack.Screen name="ProviderDetails" component={ProviderDetailsScreen} />
        <Stack.Screen name="BookService" component={BookServiceScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
        <Stack.Screen name="Review" component={ReviewScreen} />
        <Stack.Screen name="ClientAlert" component={ClientAlertScreen} />
        <Stack.Screen name="ClientSettings" component={ClientSettingsScreen} />
        <Stack.Screen name="ClientHelpCenter" component={ClientHelpCenterScreen} />
        <Stack.Screen name="ClientHelpSupport" component={ClientHelpSupportScreen} />
        <Stack.Screen name="ProviderServicePricing" component={ProviderServicePricingScreen} />
        <Stack.Screen name="ProviderAvailability" component={ProviderAvailabilityScreen} />
        <Stack.Screen name="ProviderCurrentJobs" component={ProviderCurrentJobsScreen} />
        <Stack.Screen name="ProviderCompletedJobs" component={ProviderCompletedJobsScreen} />
        <Stack.Screen name="ProviderReviews" component={ProviderReviewsScreen} />
        <Stack.Screen name="ProviderEarnings" component={ProviderEarningsScreen} />
        <Stack.Screen name="ProviderVerification" component={ProviderVerificationScreen} />
        <Stack.Screen name="ProviderSettings" component={ProviderSettingsScreen} />
        <Stack.Screen name="ProviderHelpCenter" component={ProviderHelpCenterScreen} />
        <Stack.Screen name="ProviderHelpSupport" component={ProviderHelpSupportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
