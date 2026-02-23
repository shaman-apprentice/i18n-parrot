import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { syncI18n } from '../src/index.mjs';
import { getSandboxDir } from './support/sandbox.mjs';

describe('i18n-parrot', () => {
  it('syncs and sorts single target language', async (t) => {
    const dir = await getSandboxDir(t);
    
    const enSource = {
      greeting: 'Hello',
      farewell: 'Goodbye',
      nested: { message: 'Welcome' }
    };
    await writeFile(join(dir, 'en.json'), JSON.stringify(enSource));

    // Create target file (Spanish) with missing key and unsorted
    const esTarget = {
      nested: { message: 'Bienvenido' },
      farewell: 'Adiós'
    };
    await writeFile(join(dir, 'es.json'), JSON.stringify(esTarget));

    // Run sync
    await syncI18n({ folder: dir, source: 'en.json' });

    // Verify target is synced (missing greeting from source)
    const esResult = JSON.parse(await readFile(join(dir, 'es.json'), 'utf8'));
    assert.deepEqual(esResult, {
      farewell: 'Adiós',
      greeting: 'Hello',
      nested: { message: 'Bienvenido' }
    });
  });

  it('ignores non-json files', async (t) => {
    const dir = await getSandboxDir(t);

    const enSource = { greeting: 'Hello' };
    await writeFile(join(dir, 'en.json'), JSON.stringify(enSource));
    await writeFile(join(dir, 'README.md'), 'Some notes');

    await syncI18n({ folder: dir, source: 'en.json' });

    const readmeContent = await readFile(join(dir, 'README.md'), 'utf8');
    assert.equal(readmeContent, 'Some notes');
  });
});
