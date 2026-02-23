import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { serializeSorted } from '../src/sort.helper.mjs';

describe('sort.helper', () => {
  it('sorts basic keys', () => {
    const input = {
      "b": "b",
      "a": "a"
    };
    const expected = `{
  "a": "a",
  "b": "b"
}`;
    assert.equal(serializeSorted(input), expected);
  });

  it('keeps order of arrays', () => {
    const input = {
      "messages": {
        "success": ["Saved successfully", "Deleted successfully"],
        "errors": ["Invalid email", "Password too short", "Username taken"]
      },
    };
    const expected = `{
  "messages": {
    "errors": [
      "Invalid email",
      "Password too short",
      "Username taken"
    ],
    "success": [
      "Saved successfully",
      "Deleted successfully"
    ]
  }
}`;
    assert.equal(serializeSorted(input), expected);
  });

  it('goes down to nested keys', () => {
    const input = {
      "e": "e",
      "b.c.d": {
        "b": "b",
        "a": "a"
      },
      "a": "a"
    };
    const expected = `{
  "a": "a",
  "b.c.d": {
    "a": "a",
    "b": "b"
  },
  "e": "e"
}`;
    assert.equal(serializeSorted(input), expected);
  });
});
