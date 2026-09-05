import { useState } from "react";
import { FlaskConical, X } from "lucide-react";
import { useVersion } from "../../context/VersionContext";
import { VERSION_CONFIGS } from "../../versions";
import type { AppVersion } from "../../versions";

export default function VersionSimulator() {
  const { version, config, setVersion, availableVersions } = useVersion();
  const [open, setOpen] = useState(false);

  return (
    <div
      id="version-simulator"
      data-testid="version-simulator"
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
    >
      {open && (
        <div
          role="dialog"
          aria-label="Version Simulator"
          data-testid="version-simulator-panel"
          className="w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-700 bg-slate-900 p-4 text-slate-100 shadow-2xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-200">
              <FlaskConical className="h-4 w-4 text-sunset-500" aria-hidden="true" />
              Version Simulator
            </h2>
            <button
              type="button"
              aria-label="Close version simulator"
              data-testid="version-simulator-close"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <p className="mb-3 text-xs text-slate-400">
            Current Version:{" "}
            <span data-testid="current-version-label" className="font-semibold text-slate-100">
              {version}
            </span>
          </p>

          <fieldset className="mb-4 space-y-1.5" data-testid="version-selector">
            <legend className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Application Version
            </legend>
            {availableVersions.map((v) => (
              <label
                key={v}
                htmlFor={`version-option-${v}`}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                  version === v
                    ? "border-sunset-500 bg-sunset-500/10 text-white"
                    : "border-slate-700 text-slate-300 hover:border-slate-500"
                }`}
              >
                <input
                  type="radio"
                  id={`version-option-${v}`}
                  name="app-version"
                  value={v}
                  checked={version === v}
                  onChange={() => setVersion(v as AppVersion)}
                  data-testid={`version-radio-${v}`}
                  className="h-3.5 w-3.5 accent-sunset-500"
                />
                <span className="font-medium">{v}</span>
                <span className="text-xs text-slate-500">
                  {VERSION_CONFIGS[v as AppVersion].label.replace(`${v} — `, "")}
                </span>
              </label>
            ))}
          </fieldset>

          <div data-testid="version-changes">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Changes in this version
            </p>
            <ul className="space-y-1 text-sm text-slate-300">
              {config.changes.map((change, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-sunset-500">•</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle version simulator"
        aria-expanded={open}
        data-testid="version-simulator-toggle"
        className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl transition hover:bg-slate-800"
      >
        <FlaskConical className="h-4 w-4 text-sunset-500" aria-hidden="true" />
        Dev Panel
      </button>
    </div>
  );
}
