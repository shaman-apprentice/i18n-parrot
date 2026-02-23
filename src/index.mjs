import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { serializeSorted } from './sort.helper.mjs';
import { syncValues } from './sync.helper.mjs';

/** @param {import('./options.mjs').OptionValues} options */
export async function syncI18n(options) {
  const sourcePath = join(options.folder, options.source);

	const [sourceData, targets] = await Promise.all([
    readFile(sourcePath, { encoding: 'utf8' }).then(source => JSON.parse(source)),
    readdir(options.folder).then(files => files.filter(file => file.endsWith('.json') && file !== options.source)),
  ]);

  await Promise.all([
    writeFile(sourcePath, serializeSorted(sourceData), { encoding: 'utf8' }),
    ...targets.map(target => syncTarget(sourceData, join(options.folder, target))),
  ]);
}

/**
 * @param {Record<string, any>} source 
 * @param {string} targetPath 
 */
async function syncTarget(source, targetPath) {
  const content = await readFile(targetPath, { encoding: 'utf8' });
  const syncedData = syncValues(source, JSON.parse(content));
  await writeFile(targetPath, serializeSorted(syncedData), { encoding: 'utf8' });
}
