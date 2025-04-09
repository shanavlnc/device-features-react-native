import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

type AppTheme = {
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    [key: string]: any; // For other theme properties that might exist
  };
};

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  colors: AppTheme['colors'];
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  colors: DefaultTheme.colors,
});

const girlyLightColors: AppTheme['colors'] = {
  ...DefaultTheme.colors,
  primary: '#FF9EB5',
  background: '#FFF0F5',
  card: '#FFD1DC',
  text: '#8B475D',
  border: '#FFB6C1',
};

const girlyDarkColors: AppTheme['colors'] = {
  ...DarkTheme.colors,
  primary: '#D94D6A',
  background: '#2D0E14',
  card: '#5C1D2A',
  text: '#FFC0CB',
  border: '#8B475D',
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps): JSX.Element => {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(!isDark);
  const colors = isDark ? girlyDarkColors : girlyLightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
