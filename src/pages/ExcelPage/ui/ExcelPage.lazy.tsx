import { lazy } from "react";

export const LazyExcelPage = lazy(async () => await import("./ExcelPage"));
