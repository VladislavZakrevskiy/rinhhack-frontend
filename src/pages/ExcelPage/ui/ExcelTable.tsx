import { useSystemStore } from "@/entities/System";
import { Button } from "@fluentui/react-components";
import React, { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";
import { getFormulas } from "./formulas";

export type SpreadsheetData = Matrix<CellBase>;

interface ExcelTableProps {
	data: Matrix<CellBase>;
	setData: Dispatch<SetStateAction<SpreadsheetData>>;
	handleCellChange: (newData: SpreadsheetData) => void;
}

function getRowsCount(matrix: Matrix<unknown>): number {
	return matrix.length;
}

function getColumnsCount(matrix: Matrix<unknown>): number {
	const firstRow = matrix[0];
	return firstRow ? firstRow.length : 0;
}

function getSize(matrix: Matrix<unknown>) {
	return {
		columns: getColumnsCount(matrix),
		rows: getRowsCount(matrix),
	};
}

export const ExcelTable: FC<ExcelTableProps> = ({ data, handleCellChange, setData }) => {
	const { theme } = useSystemStore();
	const { t } = useTranslation();

	const { customFormulaParser } = getFormulas();
	const addColumn = React.useCallback(
		() =>
			setData((data) =>
				data.map((row) => {
					const nextRow = [...row];
					nextRow.length += 1;
					return nextRow;
				}),
			),
		[setData],
	);

	const removeColumn = React.useCallback(() => {
		setData((data) =>
			data.map((row) => {
				return row.slice(0, row.length - 1);
			}),
		);
	}, [setData]);

	const addRow = React.useCallback(
		() =>
			setData((data) => {
				const { columns } = getSize(data);
				return [...data, Array(columns)];
			}),
		[setData],
	);

	const removeRow = React.useCallback(() => {
		setData((data) => {
			return data.slice(0, data.length - 1);
		});
	}, [setData]);

	useEffect(() => {
		const { columns, rows } = getSize(data);
		let columnLength = 10 - columns;
		let rowLength = 10 - rows;
		console.log(columnLength, rowLength);

		// if (columnLength > 0) {
		// 	while (columnLength > 0) {
		// 		console.log(columnLength);
		// 		addColumn();
		// 		columnLength--;
		// 	}
		// }

		// if (rowLength > 0) {
		// 	while (rowLength > 0) {
		// 		console.log(rowLength);
		// 		addRow();
		// 		rowLength--;
		// 	}
		// }
	}, []);

	return (
		<div>
			<div className="flex justify-between gap-2 mb-3">
				<Button onClick={addColumn}>{t("add column")}</Button>
				<Button onClick={removeColumn}>{t("remove column")}</Button>
				<Button onClick={addRow}>{t("add row")}</Button>
				<Button onClick={removeRow}>{t("remove row")}</Button>
			</div>
			<Spreadsheet
				createFormulaParser={customFormulaParser}
				darkMode={theme === "dark"}
				data={data}
				onChange={handleCellChange}
			/>
		</div>
	);
};
