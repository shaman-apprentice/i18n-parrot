/**
 * Syncs values from target into a source-structured object.
 * Returns a new object with all keys from source, using target values where available.
 *
 * @template T extends Record<string, any>
 * @param {T} source - The source object whose structure is preserved
 * @param {Record<string, any>} target - The target object whose values override source values
 * @returns {T} A new object with source structure and target's values where present with default of source values
 */
export function syncValues(source, target) {
  const result = /** @type {T} */ ({});

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(target, key))
      result[key] = isBaseType(source[key])
        ? target[key]
        : syncValues(source[key], target[key]);
    else
      result[key] = source[key];
  }

  return result;
}

/** @param {any} value */
function isBaseType(value) {
  return Array.isArray(value) || typeof value !== "object";
}
