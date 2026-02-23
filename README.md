# i18n-parrot 🦜

Sync and sort i18n JSON translation files from a source language.

## Usage

```bash
npx i18n-parrot --folder ./i18n --source en.json
```

**Options:**
- `-h, --help` — Show help
- `-f, --folder` — Folder containing i18n files (required)
- `-s, --source` — Source language file name (required)

## How It Works

1. Reads source file as template structure
2. Syncs all other `.json` files to match source keys
3. Sorts all object keys recursively
4. Preserves order of arrays
5. Missing keys from source are added with source values. Keys in targets but not in source are removed.
