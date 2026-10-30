#!/bin/sh
# Installs herdr-panel into the Herdr app. Safe to run again: it updates the mod,
# and leaves your layouts, other mods and keys as they are.
set -eu

here=$(cd "$(dirname "$0")" && pwd)
home=${HERDR_APP_HOME:-$HOME/.config/herdr-app}
name=herdr-panel

command -v herdr-app >/dev/null || { echo "herdr-app not found. Install the Herdr app first." >&2; exit 1; }
command -v python3 >/dev/null || { echo "python3 is needed to merge keys.json." >&2; exit 1; }

mkdir -p "$home/mods/$name"
cd "$here/mods/$name"
cp main.js mod.json "$home/mods/$name/"
herdr-app check "$home/mods/$name"

python3 - "$home/keys.json" keys.json <<'PY'
import json, os, sys

path, snippet = sys.argv[1:]
keys = json.load(open(path)) if os.path.exists(path) else {}

for section, bindings in json.load(open(snippet)).items():
    for key, action in bindings.items():
        used = keys.setdefault(section, {}).get(key)

        if used and used != action:
            print(f"{key} is already {used}. Kept it. Bind {action} yourself.", file=sys.stderr)
            continue

        keys[section][key] = action

with open(path, "w") as out:
    json.dump(keys, out, indent=2, ensure_ascii=False)
    out.write("\n")
PY

echo "Installed. Press cmd-j."
