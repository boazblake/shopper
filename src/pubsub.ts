type MessageHandler = <T>(x: T) => void | Promise<void>
type Unsubscribe = () => {}

type Bus = Map<string, Set<MessageHandler>>
const bus = <Bus>(new Map())

type Sub = (name: string, handler: MessageHandler) => Unsubscribe
export const sub: Sub = (name, handler) => {
  const handlers = bus.get(name) || new Set()
  handlers.add(handler)
  bus.set(name, handlers)
  return () => handlers.delete(handler)
}

type Pub = <T>(name: string, payload?: T) => T | undefined
export const pub: Pub = (name, payload) => {
  const handlers = bus.get(name) || new Set()
  handlers.forEach((f) => f(payload))
  return payload
}

export {Pub, Sub, Bus}
