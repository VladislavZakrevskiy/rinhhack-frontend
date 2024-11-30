import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";
import * as XLSX from "xlsx";
import { Header } from "@/widgets/Header/ui/Header";
import { Stack } from "@fluentui/react";

interface WebSocketMessage {
  action: string;
  data?: string;
  message?: string;
}

type SpreadsheetData = Matrix<CellBase>;

const ExcelPage: React.FC = () => {
  const [data, setData] = useState<SpreadsheetData>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isFileLoaded, setIsFileLoaded] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const pendingData = useRef<SpreadsheetData | null>(null);

  useEffect(() => {
    const socketConnection = io("http://pepper-coding.online", {
      transports: ["websocket"],
    });
    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      console.log("Socket connected: ", socketConnection.id);
      socketConnection.emit("get_file");
    });

    socketConnection.on("file_update", (message: WebSocketMessage) => {
      if (message.data) {
        try {
          console.log("Received data:", message.data);

          if (typeof message.data === "string") {
            const decodedFile = decodeBase64ToArrayBuffer(message.data);
            if (decodedFile) {
              console.log("File successfully decoded into ArrayBuffer:", decodedFile);

              const fileDownloadUrl = URL.createObjectURL(
                new Blob([decodedFile], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
              );
              setFileUrl(fileDownloadUrl);
              console.log("File download URL:", fileDownloadUrl);

              readExcelFile(decodedFile);
            } else {
              console.error("Error: file could not be decoded.");
            }
          }
        } catch (error) {
          console.error("Error decoding file:", error);
        }
      }
    });

    socketConnection.on("error", (message: WebSocketMessage) => {
      if (message.message) {
        console.error("Error: " + message.message);
      }
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const handleCellChange = (newData: SpreadsheetData) => {
    if (!isFileLoaded) {
      console.error("File is not loaded yet. Changes cannot be sent.");
      return;
    }

    setData(newData);
    pendingData.current = newData;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (socket && pendingData.current) {
        try {
          const excelBuffer = generateExcelBufferFromData(pendingData.current);

          const updatedFileUrl = URL.createObjectURL(
            new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
          );
          setFileUrl(updatedFileUrl);

          const base64File = arrayBufferToBase64(excelBuffer);
          console.log("Sending modified file in Base64 format:", base64File);

          socket.emit("upload_file", {
            filename: "modified_file.xlsx",
            data: base64File,
          });
        } catch (error) {
          console.error("Error encoding and sending file:", error);
        }
      }
    }, 5000);
  };

  const readExcelFile = async (arrayBuffer: ArrayBuffer) => {
    try {
      const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!worksheet) {
        console.error("No sheet found in workbook.");
        return;
      }

      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log("Parsed Excel data:", data);

      const matrix = data.map((row: any) => row.map((cell: any) => ({ value: cell }) as CellBase));

      setData(matrix);
      setIsFileLoaded(true);
    } catch (error) {
      console.error("Error reading or parsing Excel file:", error);
    }
  };

  return (
    <>
      <Header />
      <Stack
        horizontalAlign="center"
        style={{
          height: "100vh",
          padding: "20px",
        }}
      >
        <Stack
          tokens={{ childrenGap: 20, padding: 10 }}
          style={{
            width: "100%",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <h1>Редактирование файла</h1>
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            {isFileLoaded ? (
              <Spreadsheet
                data={data}
                onChange={handleCellChange}
                style={{ width: "100%", maxWidth: "900px", overflowX: "auto" }}
              />
            ) : (
              <p>Загрузка файла...</p>
            )}
          </div>
          {fileUrl && (
            <div>
              <a href={fileUrl} download="modified_file.xlsx">
                Скачать обновленный файл Excel
              </a>
            </div>
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default ExcelPage;

function decodeBase64ToArrayBuffer(base64: string): ArrayBuffer | null {
  try {
    const binaryString = atob(base64);
    const length = binaryString.length;
    const arrayBuffer = new ArrayBuffer(length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    return arrayBuffer;
  } catch (error) {
    console.error("Ошибка при декодировании Base64 в ArrayBuffer:", error);
    return null;
  }
}

function generateExcelBufferFromData(matrix: SpreadsheetData): ArrayBuffer {
  const workbook = XLSX.utils.book_new();
  const worksheetData = matrix.map((row) => row.map((cell) => cell?.value || ""));
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const arrayBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return arrayBuffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return btoa(binary);
}
