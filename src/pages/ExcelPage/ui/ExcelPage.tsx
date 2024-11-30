import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";
import * as XLSX from "xlsx";

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

  useEffect(() => {
    const socketConnection = io("http://pepper-coding.online", {
      transports: ["websocket"],
      query: { token: "your-token-here" },
    });
    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      console.log("Socket connected: ", socketConnection.id);
      socketConnection.emit("get_file");
    });

    socketConnection.on("file_update", (message: WebSocketMessage) => {
      if (message.data) {
        try {
          console.log("Received base64 data:", message.data);
          const decodedFile = decodeBase64ToFile(message.data);
          if (decodedFile) {
            console.log("File successfully decoded into Blob:", decodedFile);

            const fileDownloadUrl = URL.createObjectURL(decodedFile);
            setFileUrl(fileDownloadUrl);
            console.log("File download URL:", fileDownloadUrl);

            readExcelFile(decodedFile);
          } else {
            console.error("Error: file could not be saved.");
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

    if (socket) {
      try {
        const encodedData = encodeMatrixToBase64(newData);
        socket.emit("file_update", {
          action: "file_update",
          data: encodedData,
        });
      } catch (error) {
        console.error("Error encoding data:", error);
      }
    }
  };

  const readExcelFile = async (file: Blob) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!worksheet) {
        console.error("No sheet found in workbook.");
        return;
      }

      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log("Parsed Excel data:", data);

      const matrix = data.map((row: any) =>
        row.map((cell: any) => ({ value: cell } as CellBase))
      );

      setData(matrix);
      setIsFileLoaded(true);
    } catch (error) {
      console.error("Error reading or parsing Excel file:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Редактирование файла</h1>
      {isFileLoaded ? (
        <Spreadsheet data={data} onChange={handleCellChange} />
      ) : (
        <p>Загрузка файла...</p>
      )}
      {fileUrl && (
        <div>
          <a href={fileUrl} download="file.xlsx">
            Скачайте файл Excel
          </a>
        </div>
      )}
    </div>
  );
};

export default ExcelPage;

function decodeBase64ToFile(base64: string): Blob | null {
  try {
    const cleanedBase64 = cleanBase64(base64);
    console.log("Cleaned base64 data:", cleanedBase64);
    const decodedData = atob(cleanedBase64);

    const byteArray = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      byteArray[i] = decodedData.charCodeAt(i);
    }

    return new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  } catch (error) {
    console.error("Ошибка при декодировании Base64 в файл:", error);
    return null;
  }
}

function cleanBase64(base64: string): string {
  return base64.replace(/[\s\n\r]+/g, "");
}

function encodeMatrixToBase64(matrix: SpreadsheetData): string {
  const stringData = matrix
    .map((row) => row.map((cell) => (cell ? cell.value : "")).join("\t"))
    .join("\n");

  return btoa(unescape(encodeURIComponent(stringData)));
}
