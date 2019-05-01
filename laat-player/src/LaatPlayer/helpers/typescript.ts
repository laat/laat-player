export const ObjectFromEntries = <Keys extends PropertyKey, T = any>(
  entries: Iterable<[Keys, T]>
): { [k in Keys]: T } =>
  // @ts-ignore not yet available in typescript
  Object.fromEntries(entries);
