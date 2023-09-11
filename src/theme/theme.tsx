import React, {createContext, useEffect, useState, useContext} from 'react';
import {ThemeProvider as ThemeProviderStyled} from 'styled-components/native';
import {StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dark from './dark';
import light from './light';

export enum ThemeType {
  light = 'light',
  dark = 'dark',
}

const themes = {
  dark: dark,
  light: light,
};

export const ThemeContext = createContext({
  theme: ThemeType.light,
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({children}: ThemeProviderProps) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    async function getTheme() {
      const asyncTheme = await AsyncStorage.getItem('Theme');
      if (asyncTheme) {
        setTheme(asyncTheme);
      }
    }
    getTheme();
  }, []);

  function toggleTheme() {
    if (theme == ThemeType.light) {
      setTheme(ThemeType.dark);
      StatusBar.setBarStyle('light-content');
      StatusBar.setBackgroundColor('transparent');
      AsyncStorage.setItem('Theme', ThemeType.dark);
    } else {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor('transparent');
      setTheme(ThemeType.light);
      AsyncStorage.setItem('Theme', ThemeType.light);
    }
  }

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <ThemeProviderStyled theme={themes[theme]}>
        {children}
      </ThemeProviderStyled>
    </ThemeContext.Provider>
  );
};
