# herdr-panel

VS Code's `cmd-j` for the [Herdr](https://herdr.dev) app.

- **No panel:** opens a terminal under the focused pane, in that pane's folder.
- **Panel on screen:** hides it. The shell keeps running.
- **Hidden panel:** shows it again.

Each tab has its own panel.

## Install

```sh
git clone https://github.com/thadeu/herdr-panel
cd herdr-panel
./install.sh
```

The script copies the mod and adds `cmd-j` to your keys. It does not replace a key you
already use. To remove the mod, delete `~/.config/herdr-app/mods/herdr-panel` and the
`cmd-j` line in `keys.json`.

## Limits

- The panel takes half of the pane it splits. Herdr has no command to set a pane's size.
- The panel is as wide as the focused pane, not the whole tab.
- A hidden panel of a closed tab ends at the next `cmd-j`.

## License

Apache-2.0.
