import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { CellBase, Matrix } from "react-spreadsheet";
import * as XLSX from "xlsx";
import { Header } from "@/widgets/Header/ui/Header";
import { Stack } from "@fluentui/react";
import { useDebounce } from "@/shared/lib/hooks";
import { Card, Spinner, Title3 } from "@fluentui/react-components";
import { ExcelTable } from "./ExcelTable";
import ExcelModal from "@/widgets/ExcelModal/ui/ExcelModal";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface WebSocketMessage {
	action: string;
	data?: string;
	message?: string;
}

type SpreadsheetData = Matrix<CellBase>;

const ExcelPage: React.FC = () => {
	const { t } = useTranslation();
	const { id } = useParams();
	const [data, setData] = useState<SpreadsheetData>([]);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isFileLoaded, setIsFileLoaded] = useState<boolean>(false);
	const [fileUrl, setFileUrl] = useState<string | null>(null);

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
				filename: id,
				data: base64File,
			});
		} catch (error) {
			console.error("Error encoding and sending file:", error);
		}
	};

	const debouncedSendSocket = useDebounce(sendToSocket, 500);

	useEffect(() => {
		const socketConnection = io("http://pepper-coding.online", {
			transports: ["websocket"],
		});
		setSocket(socketConnection);

		socketConnection.on("connect", () => {
			// console.log("Socket connected: ", socketConnection.id);
			socketConnection.emit("get_file", { filename: id });
		});

		socketConnection.on("file_update", async (message: WebSocketMessage) => {
			// console.log(message.data);
			if (message.data) {
				try {
					// console.log("Received data:", message.data);

					const decodedFile = decodeBase64ToArrayBuffer(message.data);
					if (decodedFile) {
						// console.log("File successfully decoded into ArrayBuffer:", decodedFile);

						const fileDownloadUrl = URL.createObjectURL(
							new Blob([decodedFile], {
								type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
							}),
						);
						setFileUrl(fileDownloadUrl);
						await readExcelFile(decodedFile);
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
		// console.log("handleCellChange");
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
			// console.log("Parsed Excel data:", parsedData);

			// @ts-ignore
			const matrix = parsedData.map((row) => row.map((cell) => ({ value: cell }) as CellBase));

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
				<Card className="w-full min-h-[50vh]">
					<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
						<Title3>
							{t("redact file")} {id}
						</Title3>
						<ExcelModal />
					</div>

					<div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
						{isFileLoaded ? (
							<ExcelTable fileUrl={fileUrl!} data={data} setData={setData} handleCellChange={handleCellChange} />
						) : (
							<Spinner size="large" />
						)}
					</div>
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
