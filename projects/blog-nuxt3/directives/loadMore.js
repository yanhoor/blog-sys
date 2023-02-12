let callback = null
let scrollEl = null
function handleScroll(el, binding, vnode, prevVnode) {
  let handler, parentElSelector, scrollElSelector, parentInfo, bottomOffset
  if(typeof binding.value === 'function') {
    handler = binding.value
  }else if(binding.value && typeof binding.value == 'object'){
    ({ handler, parentElSelector, scrollElSelector } = binding.value)
  }
  if(parentElSelector){
    const parent = document.querySelector(parentElSelector)
    parentInfo = parent.getBoundingClientRect()
    bottomOffset = parentInfo.bottom
  }else{
    bottomOffset = document.documentElement.clientHeight
  }
  let timer
  if(process.client){
    scrollEl = scrollElSelector ? document.querySelector(scrollElSelector) : window
  }
  callback = () => {
    if(process.client && typeof handler === 'function'){
      clearTimeout(timer)
      timer = setTimeout(() => {
        const info = el.getBoundingClientRect()
        // console.log('=============', el.clientHeight)
        // console.log('----------handleScroll-----------', parentElSelector, info.bottom, bottomOffset)
        if(info.bottom - bottomOffset <= 50){
          const finish = handler() // 绑定的函数返回 true 表示已经全部加载完，移除监听
          if(finish) document.removeEventListener('scroll', callback)
        }
      }, 200)
    }
  }
}

const loadMore = {
  mounted(el, binding, vnode, prevVnode) {
    handleScroll(el, binding, vnode, prevVnode)
    scrollEl.addEventListener('scroll', callback)
  },
  unmounted(el, binding, vnode, prevVnode) {
    console.log('======loadMore unmounted=======')
    scrollEl.removeEventListener('scroll', callback)
  }
}

export { loadMore }
