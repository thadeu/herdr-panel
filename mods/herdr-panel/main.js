// Cmd+J as in VS Code: a terminal under the focused pane, one for each tab. The key
// opens this mod as an invisible overlay, so it works in every layout: it does its
// one job and closes. A hidden panel is a parked terminal, so it keeps running.
import { View, div } from "gpui-kit";
import { panes, focused, terminals, shared, setShared, run, props, closeOverlay } from "herdr";

const KEY = "herdr-panel", TRIES = 40, WAIT = 25;

// A closed tab leaves its hidden panel running: end it with the tab.
function sweep(saved) {
  const open = new Set(panes().map(p => p.tab));

  return Object.fromEntries(Object.entries(saved).filter(([tab, { terminal }]) => {
    if (open.has(tab)) return true;

    if (terminals().some(t => t.address === terminal)) run("terminal.kill", { terminal });

    return false;
  }));
}

export default class Panel extends View {
  init(_props, cx) {
    const f = focused(), saved = sweep(shared(KEY) ?? {});
    const close = () => props()?.overlay && closeOverlay(props().overlay);

    if (!f?.pane) return close();

    setShared(KEY, saved);

    const entry = saved[f.tab];
    const shown = entry && panes().find(p => p.terminal === entry.terminal);
    const remember = next => setShared(KEY, { ...saved, [f.tab]: next });

    if (shown) {
      run("terminal.park", { terminal: entry.terminal });

      if (panes().some(p => p.pane === entry.from)) run("pane.focus", { pane: entry.from });

      return close();
    }

    if (entry && terminals().some(t => t.address === entry.terminal)) {
      remember({ ...entry, from: f.pane });
      run("terminal.keep", { terminal: entry.terminal, place: "down" });

      cx.spawn(async cx => {
        for (let i = 0; i < TRIES; i++) {
          const back = panes().find(p => p.terminal === entry.terminal);

          if (back) {
            run("pane.focus", { pane: back.pane });
            break;
          }

          await cx.sleep(WAIT);
        }

        close();
      });

      return;
    }

    const before = new Set(panes().map(p => p.terminal));

    run("terminal.open", { place: "down", folder: f.cwd ?? undefined });

    cx.spawn(async cx => {
      for (let i = 0; i < TRIES; i++) {
        const added = panes().find(p => p.tab === f.tab && p.terminal && !before.has(p.terminal));

        if (added) {
          remember({ terminal: added.terminal, from: f.pane });
          break;
        }

        await cx.sleep(WAIT);
      }

      close();
    });
  }

  render() {
    return div();
  }
}
