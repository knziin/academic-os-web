'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Dark mode par défaut, conformément au cahier des charges.
  const [theme, setTheme] = useState<Theme>('dark');
  const [pret, setPret] = useState(false);

  useEffect(() => {
    const stocke = window.localStorage.getItem('academic-os:theme') as Theme | null;
    if (stocke === 'dark' || stocke === 'light') {
      setTheme(stocke);
    }
    setPret(true);
  }, []);

  useEffect(() => {
    if (!pret) return;
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    window.localStorage.setItem('academic-os:theme', theme);
  }, [theme, pret]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme doit être utilisé à l\'intérieur de <ThemeProvider>.');
  return ctx;
}
