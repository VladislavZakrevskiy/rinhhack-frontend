import { lazy } from "react";

export const LazyTestPage = lazy(async () => await import("./TestPage"));
