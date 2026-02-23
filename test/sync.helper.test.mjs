import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { syncValues } from '../src/sync.helper.mjs';

describe('sync.helper', () => {
  it('replaces string values', () => {
    const source = { greeting: 'Hello' };
    const target = { greeting: 'Hi' };
    assert.deepEqual(syncValues(source, target), { greeting: 'Hi' });
  });

  it('adds source values when target lacks the key', () => {
    const source = { a: 'from-source', b: 'also-source' };
    const target = { a: 'from-target' };
    assert.deepEqual(syncValues(source, target), { a: 'from-target', b: 'also-source' });
  });

  it('syncs nested objects', () => {
    const source = { user: { name: 'Alice', age: 25 } };
    const target = { user: { age: 30 } };
    assert.deepEqual(syncValues(source, target), { user: { name: 'Alice', age: 30 } });
  });

  it('replaces arrays without recursing into them', () => {
    const source = { tags: ['old1', 'old2'] };
    const target = { tags: ['new1', 'new2', 'new3'] };
    assert.deepEqual(syncValues(source, target), { tags: ['new1', 'new2', 'new3'] });
  });

  it('handles deeply nested objects', () => {
    const source = { a: { b: { c: { d: 'deep' } } } };
    const target = { a: { b: { c: { d: 'updated' } } } };
    assert.deepEqual(syncValues(source, target), { a: { b: { c: { d: 'updated' } } } });
  });

  it('syncs only partial nested updates', () => {
    const source = { user: { name: 'Alice', email: 'alice@example.com', age: 25 } };
    const target = { user: { email: 'alice.new@example.com' } };
    assert.deepEqual(syncValues(source, target), {
      user: { name: 'Alice', email: 'alice.new@example.com', age: 25 }
    });
  });

  it('removes keys not present in source', () => {
    const source = { a: 'a', b: 'b' };
    const target = { a: 'new-a', c: 'extra' };
    assert.deepEqual(syncValues(source, target), { a: 'new-a', b: 'b' });
  });

  it('syncs complex nested i18n structure', () => {
    const source = {
      messages: {
        greetings: ['Hello', 'Hi'],
        errors: { email: 'Invalid email', password: 'Too short' }
      }
    };
    const target = {
      messages: {
        greetings: ['Hola', 'Ola'],
        errors: { email: 'Correo inválido' }
      }
    };
    assert.deepEqual(syncValues(source, target), {
      messages: {
        greetings: ['Hola', 'Ola'],
        errors: { email: 'Correo inválido', password: 'Too short' }
      }
    });
  });
});
