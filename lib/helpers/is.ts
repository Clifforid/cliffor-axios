const typeOfTest = (type: string) => (thing: unknown) => typeof thing === type
// 类型守卫函数
export const isFunction = typeOfTest('function') as (thing: unknown) => thing is Function
export const isString = typeOfTest('string') as (thing: unknown) => thing is string
export const isNumber = typeOfTest('number') as (thing: unknown) => thing is number
export const isUndefined = typeOfTest('undefined') as (thing: unknown) => thing is undefined
export const isObject = (thing: unknown) => typeof thing === 'object' && thing !== null
export const isArray = <T = any>(thing: unknown): thing is T[] => Array.isArray(thing)
export const isNil = (thing: unknown) => thing === null || thing === undefined
