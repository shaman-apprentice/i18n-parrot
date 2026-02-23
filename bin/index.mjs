import { parseArgs } from "node:util";
import { OptionsDefinition, printHelp } from "../src/options.mjs";
import { syncI18n } from "../src/index.mjs";

const { values: options } = parseArgs(OptionsDefinition);

if (options.help) {
  printHelp();
  process.exit(0);
}

if (assertOptionsValid(options)) {
  await syncI18n(options);
  console.log("Successfully synced folder", options.folder)
}

/**
 * @param {import('../src/options.mjs').BaseOptionValues} options
 * @returns {options is import('../src/options.mjs').OptionValues}
 */
function assertOptionsValid(options) {
  const missingRequiredOptions = Object.entries(OptionsDefinition.options)
    // @ts-expect-error -- we know key is not a random string...
    .filter(([key, value]) => 'required' in value && value.required && options[key] === undefined)
    .map(([key]) => `"${key}"`);
  
  if (missingRequiredOptions.length > 0) {
    console.error(`Missing options: ${missingRequiredOptions.join(', ')}. See \`npx i18n-parrot --help\``)
    process.exit(1);
  }

  return true;
}
