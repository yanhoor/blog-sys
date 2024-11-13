import { createContext } from 'react'
import type { ColorMode } from '@/hooks/useColorMode'

export const ThemeContext = createContext<ColorMode>('light')
