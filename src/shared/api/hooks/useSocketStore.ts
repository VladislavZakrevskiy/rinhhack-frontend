import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { ExcelFile } from "@/shared/types/ExcelFile";
import { SocketEvent } from "@/shared/types/SocketEvent";

interface SocketStore {
  socket: Socket | null;
  excelFiles: ExcelFile[] | null;
  connectToSocket: () => void;
  listenToExcelUpdates: () => void;
  setExcelFiles: (files: ExcelFile[]) => void;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  excelFiles: null, // список файлов Excel

  connectToSocket: () => {
    const socket = io(import.meta.env.VITE_API_URL);
    set({ socket });
  },

  listenToExcelUpdates: () => {
    const socket = get().socket;
    if (socket) {
      socket.on(SocketEvent.ExcelFileUpdated, (updatedFile: ExcelFile) => {
        console.log("Excel file updated:", updatedFile);

        set((state) => {
          if (state.excelFiles) {
            const fileIndex = state.excelFiles.findIndex((file) => file.id === updatedFile.id);
            if (fileIndex >= 0) {
              const updatedFiles = [...state.excelFiles];
              updatedFiles[fileIndex] = updatedFile;
              return { excelFiles: updatedFiles };
            } else {
              return { excelFiles: [...state.excelFiles, updatedFile] };
            }
          } else {
            return { excelFiles: [updatedFile] };
          }
        });
      });
    }
  },

  setExcelFiles: (files: ExcelFile[]) => {
    set({ excelFiles: files });
  }
}));
