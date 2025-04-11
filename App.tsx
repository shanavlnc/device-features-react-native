import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import AddEntryScreen from './src/screens/AddEntryScreen';
import { ThemeProvider } from './src/utils/theme';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // Setup notification channel for Android
    const setupNotifications = async () => {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF9EB5',
      });
    };
    setupNotifications();
  }, []);

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerBackVisible: false
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ 
              title: 'DailyLife 🩷',
              headerLeft: () => null,
              headerBackVisible: false,
              headerBackTitleVisible: false,
              headerShadowVisible: false
            }}
          />
          <Stack.Screen 
            name="AddEntry" 
            component={AddEntryScreen}
            options={{ 
              title: 'DailyLife 🩷',
              headerLeft: () => null,
              headerBackVisible: false,
              headerBackTitleVisible: false,
              headerShadowVisible: false
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}