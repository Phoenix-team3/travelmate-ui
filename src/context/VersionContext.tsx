import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  APP_VERSIONS,
  DEFAULT_VERSION,
  VERSION_CONFIGS,
  getVersionConfig,
  isValidVersion,
  type AppVersion,
  type VersionConfig,
} from "../versions";

const STORAGE_KEY = "travelmate.appVersion";

interface VersionContextValue {
  version: AppVersion;
  config: VersionConfig;
  setVersion: (version: AppVersion) => void;
  availableVersions: readonly AppVersion[];
}

const VersionContext = createContext<VersionContextValue | undefined>(undefined);

function readStoredVersion(): AppVersion {
  if (typeof window === "undefined") return DEFAULT_VERSION;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isValidVersion(stored) ? stored : DEFAULT_VERSION;
}

export function VersionProvider({ children }: { children: ReactNode }) {
  const [version, setVersionState] = useState<AppVersion>(readStoredVersion);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, version);
    document.documentElement.setAttribute("data-app-version", version);
  }, [version]);

  const setVersion = (next: AppVersion) => setVersionState(next);

  const value = useMemo<VersionContextValue>(
    () => ({
      version,
      config: getVersionConfig(version),
      setVersion,
      availableVersions: APP_VERSIONS,
    }),
    [version]
  );

  return <VersionContext.Provider value={value}>{children}</VersionContext.Provider>;
}

export function useVersion(): VersionContextValue {
  const ctx = useContext(VersionContext);
  if (!ctx) throw new Error("useVersion must be used within a VersionProvider");
  return ctx;
}

export { VERSION_CONFIGS };
