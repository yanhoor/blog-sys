let callback = null
function handleScroll(el, binding, vnode, prevVnode) {
  let timer
  callback = () => {
    if(process.client){
      clearTimeout(timer)
      timer = setTimeout(() => {
        const info = el.getBoundingClientRect()
        // console.log('----------handleScroll-----------', info.bottom, document.documentElement.clientHeight, typeof binding.value)
        if(typeof binding.value === 'function' && info.bottom <= document.documentElement.clientHeight){
          const finish = binding.value() // 绑定的函数返回 true 表示已经全部加载完，移除监听
          if(finish) document.removeEventListener('scroll', callback)
        }
      }, 200)
    }
  }
}

const loadMore = {
  mounted(el, binding, vnode, prevVnode) {
    handleScroll(el, binding, vnode, prevVnode)
    document.addEventListener('scroll', callback)
  },
  unmounted(el, binding, vnode, prevVnode) {
    document.removeEventListener('scroll', callback)
  }
}

export { loadMore }
