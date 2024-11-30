import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";
import * as XLSX from "xlsx";
import { Header } from "@/widgets/Header/ui/Header";

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
		const socketConnection = io(import.meta.env.VITE_API_URL, {
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

		console.log("New data after cell edit:", newData);

		setData(newData);

		if (socket) {
			try {
				const arrayBufferData = encodeMatrixToArrayBuffer(newData);
				console.log("Encoded data ready for transmission:", arrayBufferData);

				socket.emit("file_update", {
					action: "file_update",
					data: arrayBufferData,
				});
			} catch (error) {
				console.error("Error encoding data:", error);
			}
		}
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
			<div style={{ padding: "20px" }}>
				<h1>Редактирование файла</h1>
				{isFileLoaded ? <Spreadsheet data={data} onChange={handleCellChange} /> : <p>Загрузка файла...</p>}
				{fileUrl && (
					<div>
						<a href={fileUrl} download="file.xlsx">
							Скачайте файл Excel
						</a>
					</div>
				)}
			</div>
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

function encodeMatrixToArrayBuffer(matrix: SpreadsheetData): ArrayBuffer {
	const stringData = matrix.map((row) => row.map((cell) => (cell ? cell.value : "")).join("\t")).join("\n");

	const textEncoder = new TextEncoder();
	return textEncoder.encode(stringData).buffer;
}
