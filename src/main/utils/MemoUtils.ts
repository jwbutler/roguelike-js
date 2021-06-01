function memoize<V>(key: string, valueSupplier: (k: string) => V, cache: { [k: string]: V }): V {
  if (cache[key]) {
    return cache[key];
  }

  const value = valueSupplier(key);
  cache[key] = value;
  return value;
}

export { memoize };