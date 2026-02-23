// @ts-nocheck

/**
 * Sorting keys, reducing them back to object
 * and then calling JSON.stringify works,
 * as JSON.stringify writes in enumeration order of given object
 */

/** @returns {string} */
export function serializeSorted(value) {
  return JSON.stringify(sort(value),  null, 2);
}

function sort(value) {
  if (Array.isArray(value))
    // Do NOT sort arrays as order may be meaningful
    return value.map(sort);

  if (value && typeof value === "object")
    return Object.keys(value)
      .sort((a, b) => a.localeCompare(b))
      .reduce((acc, key) => {
        acc[key] = sort(value[key]);
        return acc;
      }, {});

  return value;
}
