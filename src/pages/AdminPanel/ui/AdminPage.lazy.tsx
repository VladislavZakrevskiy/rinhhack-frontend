import { lazy } from "react";

export const LazyAdminPage = lazy(async () => await import("./AdminPage"));
