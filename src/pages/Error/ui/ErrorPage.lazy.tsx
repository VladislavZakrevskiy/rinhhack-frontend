import { lazy } from "react";

export const LazyErrorPage = lazy(async () => await import("./ErrorPage"));
