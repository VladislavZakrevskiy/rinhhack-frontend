import { create } from "zustand";
import { ExcelFile } from "@/shared/types/ExcelFile";
import { $api } from "@/shared/api/api";

interface ExcelStore {
  excelFiles: ExcelFile[] | null;
  getExcelFiles: () => Promise<void>;
  downloadExcelFile: (id: string) => Promise<void>;
}

export const useExcelStore = create<ExcelStore>((set) => ({
  excelFiles: null,
  getExcelFiles: async () => {
    try {
      const res = await $api.get<ExcelFile[]>("/excel-files");
      set({ excelFiles: res.data });
    } catch (e) {
      console.error("Error fetching Excel files:", e);
    }
  },

  downloadExcelFile: async (id: string) => {
    try {
      const res = await $api.get<Blob>(`/excel-files/${id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = id;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error("Error downloading Excel file:", e);
    }
  }
}));
