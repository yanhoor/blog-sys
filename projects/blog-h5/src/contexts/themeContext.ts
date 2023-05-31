import { createContext } from 'react'
import { ColorMode } from '@/hooks/useColorMode'

export const ThemeContext = createContext<ColorMode>('light')
