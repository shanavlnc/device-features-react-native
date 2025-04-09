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
        screenOptions={({ navigation }) => ({
          headerLeft: () => null, // Remove back arrow
        })}
      >
        <Stack.Screen 
          name="AddEntry" 
          component={AddEntryScreen}
          options={{ title: 'Add Travel Entry' }}
        />
        </Stack.Navigator>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="New Entry" component={AddEntryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}