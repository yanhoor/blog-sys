function handleScroll(el, binding, vnode, prevVnode) {
  let handler, parentElSelector, scrollElSelector, parentInfo, bottomOffset
  if (typeof binding.value === 'function') {
    handler = binding.value
  } else if (binding.value && typeof binding.value == 'object') {
    ;({ handler, parentElSelector, scrollElSelector } = binding.value)
  }
  if (parentElSelector) {
    const parent = document.querySelector(parentElSelector)
    parentInfo = parent.getBoundingClientRect()
    bottomOffset = parentInfo.bottom
  } else {
    bottomOffset = document.documentElement.clientHeight
  }
  let timer
  el.scrollEl = scrollElSelector
    ? document.querySelector(scrollElSelector)
    : window

  el.callback = () => {
    if (import.meta.client && typeof handler === 'function') {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const info = el.getBoundingClientRect()
        // console.log('=============', el.clientHeight)
        // console.log('----------handleScroll-----------', parentElSelector, info.bottom, bottomOffset)
        if (info.bottom - bottomOffset <= 50) {
          const finish = handler() // 绑定的函数返回 true 表示已经全部加载完，移除监听
          if (finish) document.removeEventListener('scroll', el.callback)
        }
      }, 200)
    }
  }
}

const loadMore = {
  mounted(el, binding, vnode, prevVnode) {
    // console.log('======loadMore mounted=======', el)
    handleScroll(el, binding, vnode, prevVnode)
    el.scrollEl.addEventListener('scroll', el.callback)
  },
  unmounted(el, binding, vnode, prevVnode) {
    // console.log('======loadMore unmounted=======', el)
    el.scrollEl.removeEventListener('scroll', el.callback)
    el.callback = null
    el.scrollEl = null
  }
}

export { loadMore }
