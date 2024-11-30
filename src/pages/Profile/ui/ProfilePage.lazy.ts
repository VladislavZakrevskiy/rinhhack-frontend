import { lazy } from "react";

export const LazyProfilePage = lazy(async () => await import("./ProfilePage"));
