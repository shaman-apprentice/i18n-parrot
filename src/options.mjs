/** @typedef {import('node:util').ParseArgsOptionDescriptor & {helpMsg?: string; required?: boolean}} OptionDescriptor */

/**
 * @typedef {Object} ParseArgsOptionsConfig
 * @property {Record<string, OptionDescriptor>} options
 * @property {true} strict
 */

/** @satisfies {ParseArgsOptionsConfig} */
export const OptionsDefinition = {
  options: {
    help: { type: "boolean", short: "h", default: false, helpMsg: "Show this help message" },
    folder: { type: "string", short: "f", required: true, helpMsg: "Path to input folder containing i18n json files"},
    source: { type: "string",  short: "s", required: true, helpMsg: "Name of source / default language json file" },
  },
  strict: true,
};

/** @typedef {ReturnType<typeof import('node:util').parseArgs<typeof OptionsDefinition>>["values"]} BaseOptionValues */
/** @typedef { {[K in keyof typeof OptionsDefinition.options]: (typeof OptionsDefinition.options)[K] extends { required: true } ? K : never}[keyof typeof OptionsDefinition.options] } RequiredOptionKeys */
/** @typedef { Exclude<keyof typeof OptionsDefinition.options, RequiredOptionKeys> } OptionalOptionKeys */
/** @typedef { Partial<{[K in OptionalOptionKeys]: BaseOptionValues[K] }> & {[K in RequiredOptionKeys]-?: Exclude<BaseOptionValues[K], undefined>} } OptionValues */

export function printHelp() {
  const lines = [];
  lines.push('Usage: i18n-parrot [options]');
  lines.push('Example: npx i18n-parrot -f ./i18n -s en');
  lines.push('Options:');

  // Build parts and compute padding so columns align nicely
  const rows = Object.entries(OptionsDefinition.options).map(([name, def]) => {
    const short = def.short ? `-${def.short}` : '  ';
    const long = `--${name}`;
    const paramInfo = def.short ? `${short}, ${long}` : `    ${long}`;
    const defaultText = 'default' in def ? JSON.stringify(def.default) : "-";
    const requiredText = 'required' in def ? def.required : false;
    return {
      paramInfo,
      typeInfo: `type: ${def.type}, required: ${requiredText}, default: ${defaultText}`,
      helpMsg: def.helpMsg,
    };
  });

  const maxParamText = rows.reduce((max, row) => Math.max(max, row.paramInfo.length), 0);
  const maxTypeInfo = rows.reduce((max, row) => Math.max(max, row.paramInfo.length), 0);

  for (const row of rows) {
    const paddedParamInfo = row.paramInfo.padEnd(maxParamText);
    const paddedTypeInfo = row.typeInfo.padEnd(maxTypeInfo);
    lines.push(`  ${paddedParamInfo}  (${paddedTypeInfo}): ${row.helpMsg}`);
  }

  console.log(lines.join('\n'));
}
