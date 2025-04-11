import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

type AppColors = {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  [key: string]: any; 
};

// 
type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  colors: AppColors;
};

// default values
const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  colors: DefaultTheme.colors,
});

// light theme 
const girlyLightColors: AppColors = {
  ...DefaultTheme.colors,
  primary: '#FF9EB5',
  background: '#FFF0F5',
  card: '#FFD1DC',
  text: '#8B475D',
  border: '#FFB6C1',
};

// dark theme 
const girlyDarkColors: AppColors = {
  ...DarkTheme.colors,
  primary: '#D94D6A',
  background: '#2D0E14',
  card: '#5C1D2A',
  text: '#FFC0CB',
  border: '#8B475D',
};

// props
interface ThemeProviderProps {
  children: ReactNode;
}

// theme provider
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDark, setIsDark] = useState(false);
  const colors = isDark ? girlyDarkColors : girlyLightColors;

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};