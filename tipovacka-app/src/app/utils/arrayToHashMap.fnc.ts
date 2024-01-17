export const arrayToHashMap = <T extends Record<K, string | number>, K extends keyof T>(key: K, array: T[]): Record<T[K], T> =>
  array.reduce((acc, item) => Object.assign(acc, {[item[key]]: item}), {} as Record<T[K], T>);
