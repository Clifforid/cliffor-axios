import { isUndefined, isArray, isObject } from './is'

export function toJSONObject<T = Object>(obj: T) {
  const stack = new Array(10)
  const visit = (source: T, i: number) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) return
      if (!('toJSON' in source)) {
        stack[i] = source
        const target: Record<string | number, any> = isArray(source) ? [] : {}
        for (const key in source) {
          const value = (source as Record<string, any>)[key]
          const reduceValue = visit(value, i + 1)
          !isUndefined(reduceValue) && (target[key] = reduceValue)
        }
        stack[i] = void 0
        return target
      }
    }
    return source
  }
  return visit(obj, 0)
}
