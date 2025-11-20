import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * useThemedClass - Utility hook that swaps class strings based on theme,
 * avoiding repeated isDarkMode checks throughout components.
 */
export const useThemedClass = () => {
  const { isDarkMode } = useTheme();

  /**
   * themed - Returns the className matching the current theme.
   * First parameter is the light theme style, second is the dark theme style.
   */
  const themed = useMemo(
    () => (lightClass: string, darkClass: string) => (isDarkMode ? darkClass : lightClass),
    [isDarkMode],
  );

  return { isDarkMode, themed };
};

