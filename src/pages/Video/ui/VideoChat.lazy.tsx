import { lazy } from "react";

export const LazyVideoChat = lazy(async () => await import("./VideoChat"));
