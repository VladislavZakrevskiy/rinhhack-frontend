import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { CellBase, Matrix } from "react-spreadsheet";
import * as XLSX from "xlsx";
import { Header } from "@/widgets/Header/ui/Header";
import { Stack } from "@fluentui/react";
import { useDebounce } from "@/shared/lib/hooks";
import { Button, Card, Spinner, Title3 } from "@fluentui/react-components";
import { t } from "i18next";
import { ExcelTable } from "./ExcelTable";
import ExcelModal from "@/widgets/ExcelModal/ui/ExcelModal";

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

  const pathname = window.location.pathname;
  const filename = pathname.split('/').pop();

	const sendToSocket = (newData: SpreadsheetData) => {
		try {
			const excelBuffer = generateExcelBufferFromData(newData);

			const updatedFileUrl = URL.createObjectURL(
				new Blob([excelBuffer], {
					type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				}),
			);
			setFileUrl(updatedFileUrl);

			const base64File = arrayBufferToBase64(excelBuffer);
			// console.log("Sending modified file in Base64 format:", base64File);
			// console.log("emit");
			socket?.emit("upload_file", {
				filename: filename,
				data: base64File,
			});
		} catch (error) {
			console.error("Error encoding and sending file:", error);
		}
	};

	const debouncedSendSocket = useDebounce(sendToSocket, 500);



	useEffect(() => {
    const token = localStorage.getItem("access_token");
		const socketConnection = io("http://pepper-coding.online", {
			transports: ["websocket"],
      auth: {
        token: `Bearer ${token}`,
      },
      });
      console.log(token)
		setSocket(socketConnection);

		socketConnection.on("connect", () => {
			// console.log("Socket connected: ", socketConnection.id);
      console.log(filename)
			socketConnection.emit("get_file", { filename });
		});

    socketConnection.on("file_update", async (message: WebSocketMessage) => {
      if (message.data) {
          try {
              const decodedFile = decodeBase64ToArrayBuffer(message.data);
              if (decodedFile) {
                  await readExcelFile(decodedFile);
                  
                  const fileDownloadUrl = URL.createObjectURL(
                      new Blob([decodedFile], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
                  );
                  setFileUrl(fileDownloadUrl);
              } else {
                  console.error("Error: file could not be decoded.");
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
    if (JSON.stringify(newData) === JSON.stringify(data)) {
      return;
    }
    if (!isFileLoaded) {
      console.error("File is not loaded yet. Changes cannot be sent.");
      return;
    }

    setData(newData);

    debouncedSendSocket(newData);
  };
  

	const readExcelFile = async (arrayBuffer: ArrayBuffer) => {
    try {
      const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!worksheet) {
        console.error("No sheet found in workbook.");
        return;
      }
  
      const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const updatedData = addEmptyRowAndColumn(parsedData);
  
      // @ts-ignore
      const matrix = updatedData.map((row) => row.map((cell) => ({ value: cell }) as CellBase));
  
      setData(matrix);
      setIsFileLoaded(true);
    } catch (error) {
      console.error("Error reading or parsing Excel file:", error);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addEmptyRowAndColumn = (data: any[]) => {
    data.push(new Array(data[0].length).fill(""));
    data.forEach(row => row.push(""));
    return data;
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
            <Card className="w-full min-h-[50vh]">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Title3>Редактирование файла</Title3>
                    <ExcelModal />
                </div>

                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    {isFileLoaded ? (
                        <ExcelTable data={data} setData={setData} handleCellChange={handleCellChange} />
                    ) : (
                        <Spinner size="large" />
                    )}
                </div>
                {fileUrl && (
                    <div>
                        <a href={fileUrl} download={filename} style={{ textDecoration: 'none' }}>
                            <Button>
                                {t("download new")}
                            </Button>
                        </a>
                    </div>
                )}
            </Card>
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
