// @ts-ignore
export const arrayToHashMap = <T extends object, K extends keyof T>(key: K, array: T[]): Record<T[K], T> =>
  // @ts-ignore
  array.reduce((acc, item) => Object.assign(acc, {[item[key]]: item}), {} as Record<T[K], T>);
