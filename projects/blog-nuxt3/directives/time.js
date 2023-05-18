const time = (el, binding) => {
  el.textContent = toAliasTime(binding.value)
}

export { time }
