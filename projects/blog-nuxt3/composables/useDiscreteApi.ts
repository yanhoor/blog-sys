import { createDiscreteApi, darkTheme } from 'naive-ui'

export const useDiscreteApi = (
  typeList: Array<'message' | 'dialog' | 'notification' | 'loadingBar'>
) => {
  const colorMode = useColorMode()

  return createDiscreteApi(typeList, {
    configProviderProps: {
      theme: colorMode.value === 'dark' ? darkTheme : null
    }
  })
}
