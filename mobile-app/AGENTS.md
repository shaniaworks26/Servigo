# ServiGo Mobile App - Agent Guidance

## Project Overview
ServiGo is a comprehensive marketplace platform connecting service providers with clients. This mobile app is built with React Native using Expo and handles:
- Customer service booking and management
- Provider profile management and verification
- Real-time messaging and notifications
- Service browsing and search

## Key Technologies
- **React Native** with Expo (v54.0.0+)
- **React Navigation** v6.x for routing
- **Redux** or Context API for state management
- **Axios** for API calls
- **AsyncStorage** for local persistence

## Important Documentation Links
- Expo docs (versioned): https://docs.expo.dev/versions/v54.0.0/
- React Native docs: https://reactnative.dev/docs/getting-started
- Expo API docs: https://docs.expo.dev/versions/latest/sdk/

## Development Guidelines

### Code Structure
```
src/
  components/       # Reusable UI components
  screens/          # Screen/page components  
  services/         # API service layer
  context/          # React Context (state management)
  hooks/            # Custom React hooks
  utils/            # Utility functions
  navigation/       # Navigation configuration
  assets/           # Images, icons, fonts
```

### API Integration
- Backend URL: Set in environment variables
- Use `services/` directory for API calls
- All API calls should handle errors and loading states
- Token-based authentication via JWT (stored in AsyncStorage)

### State Management Best Practices
- Use Context API for global state (auth, user, notifications)
- Use local state (useState) for component-level state
- Use custom hooks to extract complex logic
- Avoid prop drilling - use context when appropriate

### Common Tasks

#### Making API Calls
```javascript
import { apiClient } from '../services/api';

// Always handle errors and loading states
try {
  setLoading(true);
  const response = await apiClient.get('/endpoint', { params });
  setData(response.data);
} catch (error) {
  setError(error.message);
} finally {
  setLoading(false);
}
```

#### Navigation
```javascript
// Using useNavigation hook
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.navigate('ScreenName', { params });
```

#### Storage (Persistent Data)
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save
await AsyncStorage.setItem('key', JSON.stringify(value));

// Retrieve
const value = JSON.parse(await AsyncStorage.getItem('key'));
```

## Before Writing Code

**ALWAYS** read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before implementing:
- New Expo SDK features
- Native module usage
- Permission-related code
- Platform-specific features

## Testing & Debugging
- Use `expo start` to run the dev server
- Use `expo go` app on physical device for testing
- Use Expo DevTools for debugging
- Check console logs: `npx expo logs`

## Common Pitfalls to Avoid
1. Don't use Expo modules without checking version compatibility
2. Don't hardcode API URLs - use environment variables
3. Don't forget to handle permissions (camera, location, contacts)
4. Don't assume iOS/Android behave the same - test on both
5. Don't make API calls in render methods - use useEffect

## File Upload Restrictions (Provider Verification)
When implementing document uploads:
- Allowed formats: PDF, JPEG, PNG only
- Max file size: 10 MB per file
- Max uploads: 30 per hour per provider
- Use multipart/form-data for uploads
- Validate file type on client before uploading

## Backend Verification System
The backend provider verification system requires:
- Category selection before verification submission
- Valid verification group/path selection
- All required documents before submission
- Supports multiple verification paths per category

See backend/db/migrations/011_create_verification_system.mjs for schema details.
