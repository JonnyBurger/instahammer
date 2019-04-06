export const wait = (ms: number) =>
  new Promise(resolve => setTimeout(() => resolve('timed-out'), ms))

export const debounce = (func, wait, immediate = undefined) => {
  var timeout
  return function() {
    var context = this
    args = arguments
    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
