import React, { useEffect, useState } from "react";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
	updateCell: (data: { row: number; col: number; value: string }) => void;
}

interface ClientToServerEvents {
	joinFile: (data: { fileId: string }) => void;
	editCell: (data: { fileId: string; cell: { row: number; col: number; value: string } }) => void;
}

type SpreadsheetData = Matrix<CellBase>;

const ExcelPage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [data, setData] = useState<SpreadsheetData>([]);
	const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);

	useEffect(() => {
		const socketConnection = io("http://localhost:3000");
		setSocket(socketConnection);

		socketConnection.emit("joinFile", { fileId: id });

		socketConnection.on("updateCell", ({ row, col, value }) => {
			setData((prevData) => {
				const newData = [...prevData];
				if (!newData[row]) newData[row] = [];
				newData[row][col] = { value };
				return newData;
			});
		});

		return () => {
			socketConnection.disconnect();
		};
	}, [id]);

	const handleCellChange = (newData: SpreadsheetData) => {
		const changedCells = findChangedCells(data, newData);
		if (socket && changedCells.length > 0) {
			changedCells.forEach(({ row, col, value }) => {
				socket.emit("editCell", { fileId: id!, cell: { row, col, value } });
			});
		}
		setData(newData);
	};

	return (
		<div style={{ padding: "20px" }}>
			<h1>Редактирование файла: {id}</h1>
			<Spreadsheet data={data} onChange={handleCellChange} />
		</div>
	);
};

export default ExcelPage;

function findChangedCells(
	oldData: SpreadsheetData,
	newData: SpreadsheetData,
): { row: number; col: number; value: string }[] {
	const changes: { row: number; col: number; value: string }[] = [];
	for (let row = 0; row < newData.length; row++) {
		for (let col = 0; col < (newData[row]?.length || 0); col++) {
			const oldValue = oldData[row]?.[col]?.value || "";
			const newValue = newData[row]?.[col]?.value || "";
			if (oldValue !== newValue) {
				changes.push({ row, col, value: newValue });
			}
		}
	}
	return changes;
}
