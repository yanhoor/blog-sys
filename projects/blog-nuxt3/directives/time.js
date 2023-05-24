import { formatTime } from '~/utils/timeUtils'

const time = (el, binding) => {
  el.textContent = binding.modifiers?.format
    ? formatTime(binding.value)
    : toAliasTime(binding.value)
}

export { time }
