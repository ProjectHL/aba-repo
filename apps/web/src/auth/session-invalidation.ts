const sessionInvalidationTarget = new EventTarget()
const eventName = "session-invalidated"

export function notifySessionInvalidated() {
  sessionInvalidationTarget.dispatchEvent(new Event(eventName))
}

export function subscribeToSessionInvalidation(listener: () => void) {
  sessionInvalidationTarget.addEventListener(eventName, listener)
  return () => sessionInvalidationTarget.removeEventListener(eventName, listener)
}

