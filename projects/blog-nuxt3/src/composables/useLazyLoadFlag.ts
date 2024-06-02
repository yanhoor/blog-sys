export const useLazyLoadFlag = () => {
  return useState<boolean>('lazyLoadFlag', () => false)
}
