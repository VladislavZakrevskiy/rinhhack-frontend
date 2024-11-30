import { lazy } from "react";

export const LazyTestExcelPage = lazy(async () => await import("./TestExcelPage"));
