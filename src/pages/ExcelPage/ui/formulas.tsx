import { createFormulaParser } from "react-spreadsheet";
import { SpreadsheetData } from "./ExcelTable";
import * as math from "mathjs";
export type FormulaArg = { isArray: boolean; isCellRef: boolean; isRangeRef: boolean; value: number | number[] };

// Функция для вычисления корреляции Пирсона
const pearsonCorrelation = (range1: FormulaArg, range2: FormulaArg) => {
	const x = Array.isArray(range1.value) ? range1.value : [range1.value];
	const y = Array.isArray(range2.value) ? range2.value : [range2.value];

	if (x.length !== y.length) {
		throw new Error("Arrays must have the same length");
	}

	return math.corr(
		x.filter((a) => typeof a === "number"),
		y.filter((a) => typeof a === "number"),
	);
};

// Функция для экспоненциального сглаженного скользящего среднего (EMA)
const ema = (data: FormulaArg, alpha: number) => {
	const values = Array.isArray(data.value) ? data.value : [data.value];
	let prevEMA = values[0]; // Начинаем с первого значения

	for (let i = 1; i < values.length; i++) {
		const currentValue = values[i];
		prevEMA = alpha * (currentValue || 0) + (1 - alpha) * (prevEMA || 0);
	}
	return prevEMA;
};

// Функция для Bootstrap (для доверительных интервалов)
const bootstrap = (data: FormulaArg, iterations: number = 1000) => {
	const values = Array.isArray(data.value) ? data.value : [data.value];
	const means = [];
	for (let i = 0; i < iterations; i++) {
		const resampledData = [];
		for (let j = 0; j < values.length; j++) {
			resampledData.push(values[Math.floor(Math.random() * values.length)]);
		}
		const mean = resampledData.reduce((a, b) => a + b, 0) / resampledData.length;
		means.push(mean);
	}
	means.sort((a, b) => a - b);
	const lower = means[Math.floor(0.025 * means.length)];
	const upper = means[Math.floor(0.975 * means.length)];
	return { lower, upper }; // Доверительный интервал
};

// Функция для вычисления среднего темпа роста (CAGR)
const cagr = (startValue: FormulaArg, endValue: FormulaArg, years: FormulaArg) => {
	const start = Array.isArray(startValue.value) ? startValue.value[0] : startValue.value;
	const end = Array.isArray(endValue.value) ? endValue.value[0] : endValue.value;
	const yearCount = Array.isArray(years.value) ? years.value[0] : years.value;

	return (end / start) ** (1 / yearCount) - 1;
};

// Функция для линейной регрессии
const linearRegression = (xData: FormulaArg, yData: FormulaArg) => {
	const x = Array.isArray(xData.value) ? xData.value : [xData.value];
	const y = Array.isArray(yData.value) ? yData.value : [yData.value];
	const n = x.length;

	const sumX = x.reduce((a, b) => a + b, 0);
	const sumY = y.reduce((a, b) => a + b, 0);
	const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
	const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

	const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
	const intercept = (sumY - slope * sumX) / n;

	return { slope, intercept };
};

// Функция для Value at Risk (VaR)
const vaR = (
	data: FormulaArg,
	confidenceLevel: FormulaArg = { isArray: false, isCellRef: false, isRangeRef: false, value: 0.95 },
) => {
	const sortedData = Array.isArray(data.value) ? data.value.sort((a, b) => a - b) : [data.value].sort((a, b) => a - b);
	const index = Math.floor(
		(1 - (Array.isArray(confidenceLevel.value) ? confidenceLevel.value[0] : confidenceLevel.value)) * sortedData.length,
	);
	return sortedData[index];
};

// Функция для нормализации данных
const normalize = (data: FormulaArg) => {
	const flatData = Array.isArray(data.value) ? data.value : [data.value];
	const min = Math.min(...flatData);
	const max = Math.max(...flatData);
	return flatData.map((value) => (value - min) / (max - min));
};

// Математические и строковые функции

const pi = () => Math.PI;

const cbrt = (num: FormulaArg) => Math.cbrt(Array.isArray(num.value) ? num.value[0] : num.value);

const log = (num: FormulaArg, base: FormulaArg = { isArray: false, isCellRef: false, isRangeRef: false, value: 10 }) =>
	Math.log(Array.isArray(num.value) ? num.value[0] : num.value) /
	Math.log(Array.isArray(base.value) ? base.value[0] : base.value);

const sumsq = (range: FormulaArg) => {
	const values = Array.isArray(range.value) ? range.value : [range.value];
	return values.reduce((acc, val) => acc + val * val, 0);
};

const divide = (a: FormulaArg, b: FormulaArg) =>
	Array.isArray(b.value)
		? "Ошибка: деление на 0"
		: Array.isArray(a.value)
			? "Ошибка: деление на 0"
			: b.value === 0
				? "Ошибка: деление на 0"
				: a.value / b.value;

const join = (array: FormulaArg, separator: FormulaArg) =>
	(Array.isArray(array.value) ? array.value : [array.value]).join(
		String(Array.isArray(separator.value) ? separator.value[0] : separator.value),
	);

const replace = (str: FormulaArg, search: FormulaArg, replace: FormulaArg) =>
	Array.isArray(str.value)
		? String(str.value[0]).replace(
				String(Array.isArray(search.value) ? search.value[0] : search.value),
				String(Array.isArray(replace.value) ? replace.value[0] : replace.value),
			)
		: "";

const len = (str: FormulaArg) => (Array.isArray(str.value) ? str.value : [str.value]).length;

const upper = (str: FormulaArg) => String(Array.isArray(str.value) ? str.value[0] : str.value).toUpperCase();

const lower = (str: FormulaArg) => String(Array.isArray(str.value) ? str.value[0] : str.value).toLowerCase();

const endOfMonth = (date: FormulaArg) => {
	const dt = Array.isArray(date.value) ? new Date(date.value[0]) : new Date(date.value);
	const lastDay = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
	return lastDay;
};

const startOfMonth = (date: FormulaArg) => {
	const dt = Array.isArray(date.value) ? new Date(date.value[0]) : new Date(date.value);
	return new Date(dt.getFullYear(), dt.getMonth(), 1);
};

const dateDiff = (start: FormulaArg, end: FormulaArg) => {
	const startDate = Array.isArray(start.value) ? new Date(start.value[0]) : new Date(start.value);
	const endDate = Array.isArray(end.value) ? new Date(end.value[0]) : new Date(end.value);
	const diffInTime = endDate.getTime() - startDate.getTime();
	return diffInTime / (1000 * 3600 * 24); // Разница в днях
};

const int = (num: FormulaArg) => Math.floor(Array.isArray(num.value) ? num.value[0] : num.value);

const randomElement = (array: FormulaArg) => {
	const values = Array.isArray(array.value) ? array.value : [array.value];
	return values[Math.floor(Math.random() * values.length)];
};

const nextWeekday = (date: FormulaArg, weekday: FormulaArg) => {
	const dt = Array.isArray(date.value) ? new Date(date.value[0]) : new Date(date.value);
	const daysToAdd = (Array.isArray(weekday.value) ? weekday.value[0] : weekday.value - dt.getDay() + 7) % 7;
	const nextWeekday = new Date(dt);
	nextWeekday.setDate(dt.getDate() + daysToAdd);
	return nextWeekday;
};

const padLeft = (num: FormulaArg, length: FormulaArg) =>
	(Array.isArray(num.value) ? num.value[0] : num.value)
		.toString()
		.padStart(Array.isArray(length.value) ? length.value[0] : length.value, "0");

const padRight = (num: FormulaArg, length: FormulaArg) =>
	(Array.isArray(num.value) ? num.value[0] : num.value)
		.toString()
		.padEnd(Array.isArray(length.value) ? length.value[0] : length.value, "0");

const lessThan = (a: FormulaArg, b: FormulaArg) => (a.isArray ? false : b.isArray ? false : a.value < b.value);

const greaterThan = (a: FormulaArg, b: FormulaArg) => (a.isArray ? false : b.isArray ? false : a);

export const getFormulas = () => {
	const customFormulaParser = (data: SpreadsheetData) => {
		return createFormulaParser(data, {
			functions: {
				CORREL: pearsonCorrelation,
				EMA: ema,
				BOOTSTRAP: bootstrap,
				CAGR: cagr,
				LINEARREGRESSION: linearRegression,
				VAR: vaR,
				NORMALIZE: normalize,
				PI: pi,
				CBRT: cbrt,
				LOG: log,
				SUMSQ: sumsq,
				DIVIDE: divide,
				JOIN: join,
				REPLACE: replace,
				LEN: len,
				UPPER: upper,
				LOWER: lower,
				END_OF_MONTH: endOfMonth,
				START_OF_MONTH: startOfMonth,
				DATEDIFF: dateDiff,
				INT: int,
				RANDOM_ELEMENT: randomElement,
				NEXT_WEEKDAY: nextWeekday,
				PAD_LEFT: padLeft,
				PAD_RIGHT: padRight,
				LESS_THAN: lessThan,
				GREATER_THAN: greaterThan,
			},
		});
	};

	return { customFormulaParser };
};
