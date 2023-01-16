const wrappers = {}

export function throttle(callee, timeout) {
  let timer = null
  return (...args) => {
    if (timer) return
    timer = setTimeout(() => {
      callee(...args)
      clearTimeout(timer)
      timer = null
    }, timeout)
  }
}

const actions = {
  clickOutside(_function, params) {
    return function (event) {
      console.log('clickOutside?')
      const filterNode = document.querySelector(params.outside)
      if (filterNode.contains(event.target)) return
      _function()
    }
  },
  pressEsc(_function, params) {
    return function (event) {
      console.log('pressEsc?')
      if (event.key !== 'Escape') return
      _function()
    }
  },
  scroll(_function, params) {
    return function (event) {
      console.log('scroll?')
      _function()
    }
  },
}

export function addEvent(_function, params) {
  const node = document.querySelector(params.node)
  const func = actions[params.functionOnActions](_function, params)
  if (params.isThrottle) {
    wrappers[params.wrapper] = throttle(func, 200)
  } else {
    wrappers[params.wrapper] = func
  }
  node.addEventListener(params.eventDOM, wrappers[params.wrapper])
}

export function deleteEvent(node, event, eventFunc) {
  const nodeElem = document.querySelector(node)
  nodeElem.removeEventListener(event, wrappers[eventFunc])
}
