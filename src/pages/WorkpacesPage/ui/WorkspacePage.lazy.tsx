import { lazy } from "react";

export const LazyWorkspacePage = lazy(async () => await import("./Workspace"));
