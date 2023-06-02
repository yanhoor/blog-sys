import { useEffect, useState } from 'react'
import MyConfig from '@/config'

export type ColorMode = 'dark' | 'light'
type ColorPreference = ColorMode | 'system'

export function useColorMode() {
  const [value, setValue] = useState<ColorMode>('light')
  const [preference, setPreference] = useState<ColorPreference>('system')

  useEffect(() => {
    const memo = localStorage.getItem(MyConfig.COLOR_MODE_KEY) ?? 'system'
    setPreference(memo as ColorPreference)
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handleSystemModeChange)

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', handleSystemModeChange)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(MyConfig.COLOR_MODE_KEY, preference)
    if (preference === 'system') {
      setValue(
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      )
    } else {
      setValue(preference as ColorMode)
    }
  }, [preference])

  useEffect(() => {
    document.documentElement.classList.add(value)
    document.documentElement.classList.remove(
      value === 'dark' ? 'light' : 'dark'
    )
  }, [value])

  function handleSystemModeChange(e: MediaQueryListEvent) {
    setValue(e.matches ? 'dark' : 'light')
  }

  return {
    value,
    preference,
    setPreference
  }
}
