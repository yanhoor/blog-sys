import { formatTime, toAliasTime } from 'sys-types'

const time = (el, binding) => {
  el.textContent = binding.modifiers?.format
    ? formatTime(binding.value)
    : toAliasTime(binding.value)
}

export { time }
