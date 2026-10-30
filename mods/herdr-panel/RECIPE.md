# herdr-panel

Cmd+J from VS Code for the Herdr app: a shell under the focused pane, in that pane's
folder. Press it again to hide the shell, and again to show it with its work intact.

**What you see:** a normal terminal pane under the focused pane. Each tab has one panel.

**How it behaves:** with no panel, `cmd-j` opens one and focuses it. With a panel on
screen, `cmd-j` hides it and focuses the pane you came from. With a hidden panel,
`cmd-j` shows it and focuses it. If the shell exited, `cmd-j` opens a new one. Closing
a tab with a hidden panel ends that panel at the next `cmd-j`.

**Built from:** a `place: none` mod opened by `mod.open:herdr-panel` as an invisible
overlay, so no layout changes. It uses `terminal.open`, `terminal.park`,
`terminal.keep`, `terminal.kill`, `pane.focus`, and `shared("herdr-panel")`, which maps
a tab to its panel and the pane to go back to.

**Watch out:** there is no key-only way to run mod logic, so the overlay is the trigger.
`terminal.open` applies a moment later: poll `panes()` for the new terminal. Parked
terminals outlive their tab. Herdr has no pane resize command, so a panel takes half
of the pane it splits. It is as wide as the focused pane, not the whole tab.

**Done when:** `herdr-app check` passes. A command run in the panel is still on screen
after hide and show. Focus returns on hide. No terminal stays after its tab closes.
