let callback = null
let scrollEl = null
function handleScroll(el, binding, vnode, prevVnode) {
  let handler, parentElSelector, scrollElSelector
  if(typeof binding.value === 'function') {
    handler = binding.value
  }else if(binding.value && typeof binding.value == 'object'){
    ({ handler, parentElSelector, scrollElSelector } = binding.value)
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
        // console.log('----------handleScroll-----------', parentElSelector, info.bottom - document.documentElement.clientHeight)
        if(parentElSelector){
          // 参数为父元素的id
          const parent = document.querySelector(parentElSelector)
          const parentInfo = parent.getBoundingClientRect()
          if(info.bottom - parentInfo.bottom <= 50 ){
            const finish = handler() // 绑定的函数返回 true 表示已经全部加载完，移除监听
            if(finish) document.removeEventListener('scroll', callback)
          }
        }else if(info.bottom - document.documentElement.clientHeight <= 50){
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
    scrollEl.removeEventListener('scroll', callback)
  }
}

export { loadMore }
