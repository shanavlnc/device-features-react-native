import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import AddEntryScreen from './src/screens/AddEntryScreen';
import { ThemeProvider } from './src/utils/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Home"
          screenOptions={{
            headerBackVisible: false // This disables back button globally
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