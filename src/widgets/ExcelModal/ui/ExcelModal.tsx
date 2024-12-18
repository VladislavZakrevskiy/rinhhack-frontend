import { TextField } from "@fluentui/react";
import {
	Dialog,
	DialogTrigger,
	DialogSurface,
	DialogBody,
	DialogTitle,
	DialogContent,
	Button,
} from "@fluentui/react-components";
import { DocumentQuestionMarkRegular } from "@fluentui/react-icons";
import { useState } from "react";

const formulasHelpText = [
	{ name: "ABS(A1)", description: "Возвращает абсолютное значение числа." },
	{ name: "ACOS(A1)", description: "Возвращает арккосинус числа." },
	{ name: "ACOSH(A1)", description: "Возвращает гиперболический арккосинус числа." },
	{ name: "ACOT(A1)", description: "Возвращает арккотангенс числа." },
	{ name: "ACOTH(A1)", description: "Возвращает гиперболический арккотангенс числа." },
	{ name: "ADDRESS(A1; B2)", description: "Возвращает адрес ячейки в виде текста." },
	{ name: "AND(A1; B2)", description: "Возвращает ИСТИНА, если все аргументы истинны." },
	{ name: "ARABIC(A1)", description: "Преобразует римские числа в арабские." },
	{ name: "AREAS(A1)", description: "Возвращает количество областей в ссылке." },
	{ name: "ASC(A1)", description: "Преобразует текст в набор символов ASCII." },
	{ name: "ASIN(A1)", description: "Возвращает арксинус числа." },
	{ name: "ASINH(A1)", description: "Возвращает гиперболический арксинус числа." },
	{ name: "ATAN(A1)", description: "Возвращает арктангенс числа." },
	{ name: "ATAN2(A1; B2)", description: "Возвращает арктангенс угла, используя x и y." },
	{ name: "ATANH(A1)", description: "Возвращает гиперболический арктангенс числа." },
	{ name: "AVEDEV(A1; B2)", description: "Возвращает среднее отклонение данных от их среднего." },
	{ name: "AVERAGE(A1; B2)", description: "Вычисляет среднее арифметическое значений." },
	{ name: "AVERAGEA(A1; B2)", description: "Вычисляет среднее, включая текстовые и логические значения." },
	{ name: "AVERAGEIF(A1; B2; C1)", description: "Вычисляет среднее только для ячеек, соответствующих критериям." },
	{ name: "VLOOKUP(A1; B2; C1; D1)", description: "Ищет значение в таблице по строке." },
	{ name: "BAHTTEXT(A1)", description: "Преобразует число в текст с валютой бат (тайская валюта)." },
	{ name: "BASE(A1; B2)", description: "Преобразует число в текст в указанной системе счисления." },
	{ name: "BESSELI(A1; B2)", description: "Возвращает модифицированную функцию Бесселя первого рода." },
	{ name: "BESSELJ(A1; B2)", description: "Возвращает функцию Бесселя первого рода." },
	{ name: "BESSELK(A1; B2)", description: "Возвращает модифицированную функцию Бесселя второго рода." },
	{ name: "BESSELY(A1; B2)", description: "Возвращает функцию Бесселя второго рода." },
	{ name: "BETA.DIST(A1; B2; C1; D1)", description: "Возвращает бета-распределение." },
	{ name: "BETA.INV(A1; B2; C1; D1)", description: "Возвращает обратное значение бета-распределения." },
	{ name: "BIN2DEC(A1)", description: "Преобразует двоичное число в десятичное." },
	{ name: "BIN2HEX(A1)", description: "Преобразует двоичное число в шестнадцатеричное." },
	{ name: "BIN2OCT(A1)", description: "Преобразует двоичное число в восьмеричное." },
	{ name: "BINOM.DIST(A1; B2; C1; D1)", description: "Возвращает биномиальное распределение." },
	{
		name: "BINOM.DIST.RANGE(A1; B2; C1; D1)",
		description: "Возвращает вероятность попадания в определенный диапазон значений для биномиального распределения.",
	},
	{
		name: "BINOM.INV(A1; B2; C1)",
		description:
			"Возвращает наименьшее значение, для которого кумулятивное биномиальное распределение >= заданному критерию.",
	},
	{ name: "BITAND(A1; B2)", description: "Возвращает побитовую операцию И двух чисел." },
	{ name: "BITLSHIFT(A1; B2)", description: "Сдвигает биты числа влево на указанное количество позиций." },
	{ name: "BITOR(A1; B2)", description: "Возвращает побитовую операцию ИЛИ двух чисел." },
	{ name: "BITRSHIFT(A1; B2)", description: "Сдвигает биты числа вправо на указанное количество позиций." },
	{ name: "BITXOR(A1; B2)", description: "Возвращает побитовую операцию ИСКЛЮЧАЮЩЕЕ ИЛИ двух чисел." },
	{ name: "CEILING(A1; B2)", description: "Округляет число до ближайшего целого, кратного указанному значению." },
	{ name: "CEILING.MATH(A1; B2)", description: "Округляет число вверх по математическим правилам." },
	{
		name: "CEILING.PRECISE(A1; B2)",
		description: "Округляет число вверх до ближайшего кратного без учета знака числа.",
	},
	{ name: "CHAR(A1)", description: "Возвращает символ по его коду ASCII." },
	{ name: "CHISQ.DIST(A1; B2)", description: "Возвращает значение распределения хи-квадрат." },
	{ name: "CHISQ.DIST.RT(A1; B2)", description: "Возвращает распределение хи-квадрат для правой области." },
	{ name: "CHISQ.INV(A1; B2)", description: "Возвращает обратное значение распределения хи-квадрат." },
	{
		name: "CHISQ.INV.RT(A1; B2)",
		description: "Возвращает обратное значение распределения хи-квадрат для правой области.",
	},
	{ name: "CHISQ.TEST(A1; B2)", description: "Возвращает вероятность для хи-квадрат статистики." },
	{ name: "CLEAN(A1)", description: "Удаляет все непечатаемые символы из текста." },
	{ name: "CODE(A1)", description: "Возвращает числовой код первого символа в текстовой строке." },
	{ name: "COLUMN(A1)", description: "Возвращает номер столбца для указанной ячейки." },
	{ name: "COLUMNS(A1; B2)", description: "Возвращает количество столбцов в массиве или ссылке." },
	{ name: "COMBIN(A1; B2)", description: "Возвращает количество комбинаций для заданного количества элементов." },
	{
		name: "COMBINA(A1; B2)",
		description: "Возвращает количество комбинаций с повторением для заданного количества элементов.",
	},
	{ name: "COMPLEX(A1; B2; C1)", description: "Преобразует коэффициенты в комплексное число." },
	{ name: "CONCAT(A1; B2)", description: "Объединяет текстовые строки в одну строку." },
	{ name: "CONCATENATE(A1; B2)", description: "Соединяет несколько текстовых строк в одну." },
	{ name: "CONFIDENCE.NORM(A1; B2; C1)", description: "Возвращает интервал доверия для среднего значения." },
	{
		name: "CONFIDENCE.T(A1; B2; C1)",
		description: "Возвращает интервал доверия для среднего значения, используя t-распределение.",
	},
	{ name: "CORREL(A1; B2)", description: "Возвращает коэффициент корреляции между двумя наборами данных." },
	{ name: "COS(A1)", description: "Возвращает косинус угла." },
	{ name: "COSH(A1)", description: "Возвращает гиперболический косинус числа." },
	{ name: "COT(A1)", description: "Возвращает котангенс угла." },
	{ name: "COTH(A1)", description: "Возвращает гиперболический котангенс числа." },
	{ name: "COUNT(A1; B2)", description: "Возвращает количество числовых значений в диапазоне." },
	{ name: "COUNTIF(A1; B2; C1)", description: "Возвращает количество ячеек, соответствующих критерию." },
	{ name: "COVARIANCE.P(A1; B2)", description: "Возвращает ковариацию для генеральной совокупности." },
	{ name: "COVARIANCE.S(A1; B2)", description: "Возвращает ковариацию для выборки." },
	{ name: "CSC(A1)", description: "Возвращает косеканс угла." },
	{ name: "CSCH(A1)", description: "Возвращает гиперболический косеканс числа." },
	{ name: "DATE(A1; B2; C1)", description: "Возвращает число, представляющее дату." },
	{ name: "DATEDIF(A1; B2; C1)", description: "Возвращает разницу между датами в указанной единице времени." },
	{ name: "DATEVALUE(A1)", description: "Преобразует дату в текстовом формате в число." },
	{ name: "DAY(A1)", description: "Возвращает день месяца из указанной даты." },
	{ name: "DAYS(A1; B2)", description: "Возвращает количество дней между двумя датами." },
	{
		name: "DAYS360(A1; B2)",
		description: "Возвращает количество дней между двумя датами, считая, что в месяце 30 дней.",
	},
	{ name: "DEC2BIN(A1; B2)", description: "Преобразует десятичное число в двоичное." },
	{ name: "DEC2HEX(A1; B2)", description: "Преобразует десятичное число в шестнадцатеричное." },
	{ name: "DEC2OCT(A1; B2)", description: "Преобразует десятичное число в восьмеричное." },
	{
		name: "DECIMAL(A1; B2)",
		description: "Преобразует текстовое представление числа в указанной системе счисления в десятичное число.",
	},
	{ name: "DEGREES(A1)", description: "Преобразует радианы в градусы." },
	{ name: "DELTA(A1; B2)", description: "Возвращает 1, если два числа равны; иначе 0." },
	{ name: "DEVSQ(A1; B2)", description: "Возвращает сумму квадратов отклонений." },
	{ name: "DOLLAR(A1; B2)", description: "Преобразует число в текст в денежном формате." },
	{ name: "EDATE(A1; B2)", description: "Возвращает дату через указанное количество месяцев от начальной даты." },
	{
		name: "EOMONTH(A1; B2)",
		description: "Возвращает последнюю дату месяца через указанное количество месяцев от начальной даты.",
	},
	{ name: "ERF(A1)", description: "Возвращает функцию ошибок." },
	{ name: "ERFC(A1)", description: "Возвращает дополнительную функцию ошибок." },
	{ name: "ERROR.TYPE(A1)", description: "Возвращает номер соответствующей ошибки." },
	{ name: "EVEN(A1)", description: "Округляет число до ближайшего четного целого числа." },
	{ name: "EXACT(A1; B2)", description: "Проверяет, идентичны ли две текстовые строки." },
	{ name: "EXP(A1)", description: "Возвращает e в степени указанного числа." },
	{ name: "EXPON.DIST(A1; B2)", description: "Возвращает экспоненциальное распределение." },
	{ name: "FACT(A1)", description: "Возвращает факториал числа." },
	{ name: "FALSE()", description: "Возвращает логическое значение ЛОЖЬ." },
	{ name: "FIND(A1; B2)", description: "Ищет одну строку внутри другой и возвращает начальную позицию." },
	{ name: "FINDB(A1; B2)", description: "Ищет одну строку внутри другой и возвращает начальную позицию в байтах." },
	{ name: "FISHER(A1)", description: "Возвращает преобразование Фишера для заданного числа." },
	{ name: "FISHERINV(A1)", description: "Возвращает обратное преобразование Фишера для заданного числа." },
	{
		name: "FIXED(A1; B2)",
		description: "Округляет число до указанного количества десятичных знаков и возвращает результат в виде текста.",
	},
	{ name: "FLOOR(A1; B2)", description: "Округляет число вниз до ближайшего кратного указанному значению." },
	{ name: "FLOOR.MATH(A1; B2)", description: "Округляет число вниз по математическим правилам." },
	{ name: "FLOOR.PRECISE(A1; B2)", description: "Округляет число вниз без учета знака." },
	{ name: "FORECAST(A1; B2)", description: "Возвращает прогнозируемое значение на основе линейной регрессии." },
	{
		name: "FORECAST.LINEAR(A1; B2)",
		description: "Возвращает линейное прогнозирование на основе существующих данных.",
	},
	{ name: "FREQUENCY(A1; B2)", description: "Возвращает частоты в диапазонах." },
	{ name: "GAMMA(A1)", description: "Возвращает гамма-функцию для указанного числа." },
	{ name: "GAMMA.DIST(A1; B2)", description: "Возвращает гамма-распределение." },
	{ name: "GAMMA.INV(A1; B2)", description: "Возвращает обратное значение гамма-распределения." },
	{ name: "GAMMALN(A1)", description: "Возвращает натуральный логарифм гамма-функции." },
	{ name: "GAMMALN.PRECISE(A1)", description: "Возвращает точное значение натурального логарифма гамма-функции." },
	{
		name: "GAUSS(A1)",
		description:
			"Возвращает вероятность нормального распределения для среднего значения 0 и стандартного отклонения 1.",
	},
	{ name: "GCD(A1; B2)", description: "Возвращает наибольший общий делитель двух или более чисел." },
	{ name: "GEOMEAN(A1; B2)", description: "Возвращает среднее геометрическое для положительных чисел." },
	{ name: "GESTEP(A1; B2)", description: "Возвращает 1, если число >= порога; иначе 0." },
	{ name: "GROWTH(A1; B2)", description: "Возвращает прогнозируемые значения на основе экспоненциального роста." },
	{ name: "HARMEAN(A1; B2)", description: "Возвращает среднее гармоническое для набора чисел." },
	{ name: "HEX2BIN(A1; B2)", description: "Преобразует шестнадцатеричное число в двоичное." },
	{ name: "HEX2DEC(A1; B2)", description: "Преобразует шестнадцатеричное число в десятичное." },
	{ name: "HEX2OCT(A1; B2)", description: "Преобразует шестнадцатеричное число в восьмеричное." },
	{
		name: "HLOOKUP(A1; B2; C1)",
		description: "Выполняет поиск значения в строках массива и возвращает значение из указанной строки.",
	},
	{ name: "HOUR(A1)", description: "Возвращает час из значения времени." },
	{ name: "HYPGEOM.DIST(A1; B2; C1; D1)", description: "Возвращает гипергеометрическое распределение." },
	{ name: "IF(A1; B2; C1)", description: "Возвращает значение, если условие истинно, и другое значение, если ложно." },
	{ name: "IFERROR(A1; B2)", description: "Возвращает значение, если ошибка, и другое значение, если нет ошибки." },
	{ name: "IFNA(A1; B2)", description: "Возвращает значение, если ошибка #Н/Д, и другое значение, если нет ошибки." },
	{
		name: "IFS(A1; B2; C1; D1)",
		description: "Проверяет несколько условий и возвращает значение для первого истинного.",
	},
	{ name: "IMABS(A1)", description: "Возвращает модуль комплексного числа." },
	{ name: "IMAGINARY(A1)", description: "Возвращает мнимую часть комплексного числа." },
	{ name: "IMARGUMENT(A1)", description: "Возвращает аргумент (фазовый угол) комплексного числа." },
	{ name: "IMCONJUGATE(A1)", description: "Возвращает сопряженное комплексное число." },
	{ name: "IMCOS(A1)", description: "Возвращает косинус комплексного числа." },
	{ name: "IMCOSH(A1)", description: "Возвращает гиперболический косинус комплексного числа." },
	{ name: "IMCOT(A1)", description: "Возвращает котангенс комплексного числа." },
	{ name: "IMCSC(A1)", description: "Возвращает косеканс комплексного числа." },
	{ name: "IMCSCH(A1)", description: "Возвращает гиперболический косеканс комплексного числа." },
	{ name: "IMDIV(A1; B2)", description: "Возвращает частное от деления двух комплексных чисел." },
	{ name: "IMEXP(A1)", description: "Возвращает экспоненту комплексного числа." },
	{ name: "IMLN(A1)", description: "Возвращает натуральный логарифм комплексного числа." },
	{ name: "IMLOG10(A1)", description: "Возвращает десятичный логарифм комплексного числа." },
	{ name: "IMLOG2(A1)", description: "Возвращает двоичный логарифм комплексного числа." },
	{ name: "IMPOWER(A1; B2)", description: "Возводит комплексное число в указанную степень." },
	{ name: "IMPRODUCT(A1; B2)", description: "Возвращает произведение комплексных чисел." },
	{ name: "IMREAL(A1)", description: "Возвращает действительную часть комплексного числа." },
	{ name: "IMSEC(A1)", description: "Возвращает секанс комплексного числа." },
	{ name: "IMSECH(A1)", description: "Возвращает гиперболический секанс комплексного числа." },
	{ name: "IMSIN(A1)", description: "Возвращает синус комплексного числа." },
	{ name: "IMSINH(A1)", description: "Возвращает гиперболический синус комплексного числа." },
	{ name: "IMSQRT(A1)", description: "Возвращает квадратный корень комплексного числа." },
	{ name: "IMSUB(A1; B2)", description: "Возвращает разность двух комплексных чисел." },
	{ name: "IMSUM(A1; B2)", description: "Возвращает сумму двух или более комплексных чисел." },
	{ name: "IMTAN(A1)", description: "Возвращает тангенс комплексного числа." },
	{
		name: "INDEX(A1; B2; C1)",
		description: "Возвращает значение элемента из таблицы или диапазона по заданным координатам.",
	},
	{ name: "INT(A1)", description: "Округляет число вниз до ближайшего целого." },
	{ name: "INTERCEPT(A1; B2)", description: "Возвращает точку пересечения прямой с осью y." },
	{ name: "ISBLANK(A1)", description: "Проверяет, пуста ли указанная ячейка." },
	{ name: "ISERR(A1)", description: "Проверяет, содержит ли ячейка ошибку, кроме #Н/Д." },
	{ name: "ISERROR(A1)", description: "Проверяет, содержит ли ячейка ошибку." },
	{ name: "ISEVEN(A1)", description: "Проверяет, является ли число четным." },
	{ name: "ISLOGICAL(A1)", description: "Проверяет, содержит ли ячейка логическое значение." },
	{ name: "ISNA(A1)", description: "Проверяет, содержит ли ячейка ошибку #Н/Д." },
	{ name: "ISNONTEXT(A1)", description: "Проверяет, не содержит ли ячейка текстовое значение." },
	{ name: "ISNUMBER(A1)", description: "Проверяет, содержит ли ячейка числовое значение." },
	{ name: "ISO.CEILING(A1; B2)", description: "Округляет число вверх до ближайшего кратного без учета знака." },
	{ name: "ISOWEEKNUM(A1)", description: "Возвращает номер недели года в формате ISO." },
	{ name: "ISREF(A1)", description: "Проверяет, является ли значение ссылкой." },
	{ name: "ISTEXT(A1)", description: "Проверяет, содержит ли ячейка текст." },
	{ name: "KURT(A1)", description: "Возвращает эксцесс данных." },
	{ name: "LCM(A1; B2)", description: "Возвращает наименьшее общее кратное чисел." },
	{ name: "LEFT(A1; B2)", description: "Возвращает заданное число символов из начала строки." },
	{ name: "LEFTB(A1; B2)", description: "Возвращает заданное число байтов из начала строки." },
	{ name: "LN(A1)", description: "Возвращает натуральный логарифм числа." },
	{ name: "LOG(A1; B2)", description: "Возвращает логарифм числа по указанному основанию." },
	{ name: "LOG10(A1)", description: "Возвращает десятичный логарифм числа." },
	{ name: "LOGNORM.DIST(A1; B2)", description: "Возвращает логнормальное распределение." },
	{ name: "LOGNORM.INV(A1; B2)", description: "Возвращает обратное значение логнормального распределения." },
	{ name: "LOWER(A1)", description: "Преобразует все буквы текста в строчные." },
	{ name: "MDETERM(A1; B2)", description: "Возвращает определитель матрицы." },
	{ name: "MID(A1; B2; C1)", description: "Возвращает указанное число символов из середины строки." },
	{ name: "MIDB(A1; B2; C1)", description: "Возвращает указанное число байтов из строки." },
	{ name: "MINUTE(A1)", description: "Возвращает минуту из времени." },
	{ name: "MMULT(A1; B2)", description: "Возвращает произведение двух матриц." },
	{ name: "MOD(A1; B2)", description: "Возвращает остаток от деления одного числа на другое." },
	{ name: "MONTH(A1)", description: "Возвращает месяц из даты." },
	{ name: "MROUND(A1; B2)", description: "Округляет число до ближайшего кратного." },
	{
		name: "MULTINOMIAL(A1; B2)",
		description: "Возвращает отношение факториалов суммы чисел к произведению их факториалов.",
	},
	{ name: "MUNIT(A1; B2)", description: "Возвращает единичную матрицу указанного размера." },
	{ name: "N(A1)", description: "Возвращает число, преобразованное из значения, если это возможно." },
	{ name: "NA()", description: "Возвращает ошибку #Н/Д." },
	{ name: "NEGBINOM.DIST(A1; B2)", description: "Возвращает отрицательное биномиальное распределение." },
	{ name: "NETWORKDAYS(A1; B2)", description: "Возвращает количество рабочих дней между двумя датами." },
	{
		name: "NETWORKDAYS.INTL(A1; B2)",
		description: "Возвращает количество рабочих дней между двумя датами с учетом выходных.",
	},
	{ name: "NORM.DIST(A1; B2)", description: "Возвращает нормальное распределение." },
	{ name: "NORM.INV(A1; B2)", description: "Возвращает обратное значение нормального распределения." },
	{ name: "NORM.S.DIST(A1)", description: "Возвращает стандартное нормальное распределение." },
	{ name: "NORM.S.INV(A1)", description: "Возвращает обратное значение стандартного нормального распределения." },
	{ name: "NOT(A1)", description: "Возвращает логическое отрицание значения." },
	{ name: "NOW()", description: "Возвращает текущие дату и время." },
	{ name: "NUMBERVALUE(A1; B2)", description: "Преобразует текст в число с учетом параметров формата." },
	{ name: "OCT2BIN(A1; B2)", description: "Преобразует восьмеричное число в двоичное." },
	{ name: "OCT2DEC(A1; B2)", description: "Преобразует восьмеричное число в десятичное." },
	{ name: "OCT2HEX(A1; B2)", description: "Преобразует восьмеричное число в шестнадцатеричное." },
	{ name: "ODD(A1)", description: "Округляет число до ближайшего нечетного целого." },
	{ name: "OR(A1; B2)", description: "Возвращает ИСТИНА, если хотя бы один аргумент истинен." },
	{ name: "PHI(A1)", description: "Возвращает значение функции плотности стандартного нормального распределения." },
	{ name: "PI()", description: "Возвращает значение числа π." },
	{ name: "POISSON.DIST(A1; B2)", description: "Возвращает распределение Пуассона." },
	{ name: "POWER(A1; B2)", description: "Возводит число в степень." },
	{ name: "PRODUCT(A1; B2)", description: "Возвращает произведение значений." },
	{ name: "PROPER(A1)", description: "Преобразует первую букву каждого слова строки в прописную." },
	{ name: "QUOTIENT(A1; B2)", description: "Возвращает целую часть от деления." },
	{ name: "RADIANS(A1)", description: "Преобразует градусы в радианы." },
	{ name: "RAND()", description: "Возвращает случайное число от 0 до 1." },
	{ name: "RANDBETWEEN(A1; B2)", description: "Возвращает случайное число в указанном диапазоне." },
	{ name: "REPLACE(A1; B2; C1)", description: "Заменяет часть строки другой строкой." },
	{ name: "REPLACEB(A1; B2; C1)", description: "Заменяет часть строки другой строкой на основе байтов." },
	{ name: "REPT(A1; B2)", description: "Повторяет текст заданное число раз." },
	{ name: "RIGHT(A1; B2)", description: "Возвращает указанное количество символов с конца строки." },
	{ name: "RIGHTB(A1; B2)", description: "Возвращает указанное количество байтов с конца строки." },
	{ name: "ROMAN(A1; B2)", description: "Преобразует число в римские цифры." },
	{ name: "ROUND(A1; B2)", description: "Округляет число до указанного количества знаков." },
	{ name: "ROUNDDOWN(A1; B2)", description: "Округляет число вниз до ближайшего целого." },
	{ name: "ROUNDUP(A1; B2)", description: "Округляет число вверх до ближайшего целого." },
	{ name: "ROW(A1)", description: "Возвращает номер строки указанной ячейки." },
	{ name: "ROWS(A1; B2)", description: "Возвращает количество строк в массиве или диапазоне." },
	{ name: "SEARCH(A1; B2)", description: "Ищет текст в строке, возвращая позицию первого вхождения." },
	{ name: "SEARCHB(A1; B2)", description: "Ищет текст в строке с учетом байтов, возвращая позицию первого вхождения." },
	{ name: "SEC(A1)", description: "Возвращает секанс угла в радианах." },
	{ name: "SECH(A1)", description: "Возвращает гиперболический секанс угла в радианах." },
	{ name: "SECOND(A1)", description: "Возвращает секунду из времени." },
	{ name: "SERIESSUM(A1; B2)", description: "Вычисляет сумму ряда, заданного степенями." },
	{ name: "SIGN(A1)", description: "Возвращает знак числа: 1 для положительных, -1 для отрицательных и 0 для нуля." },
	{ name: "SIN(A1)", description: "Возвращает синус угла в радианах." },
	{ name: "SINH(A1)", description: "Возвращает гиперболический синус угла." },
	{ name: "SQRT(A1)", description: "Возвращает квадратный корень из числа." },
	{ name: "SQRTPI(A1)", description: "Возвращает квадратный корень из произведения числа и числа π." },
	{ name: "STANDARDIZE(A1; B2)", description: "Возвращает стандартное отклонение для заданного значения." },
	{ name: "SUM(A1; B2)", description: "Возвращает сумму чисел." },
	{ name: "SUMIF(A1; B2)", description: "Вычисляет сумму ячеек, удовлетворяющих условию." },
	{ name: "SUMPRODUCT(A1; B2)", description: "Возвращает сумму произведений значений в нескольких массивах." },
	{ name: "SUMSQ(A1; B2)", description: "Возвращает сумму квадратов значений." },
	{
		name: "SUMX2MY2(A1; B2)",
		description: "Вычисляет сумму разностей квадратов соответствующих элементов двух массивов.",
	},
	{ name: "SUMX2PY2(A1; B2)", description: "Вычисляет сумму суммы квадратов соответствующих элементов двух массивов." },
	{
		name: "SUMXMY2(A1; B2)",
		description: "Вычисляет сумму квадратов разностей соответствующих элементов двух массивов.",
	},
	{ name: "T(A1)", description: "Возвращает текстовое значение ячейки." },
	{ name: "T.DIST(A1; B2)", description: "Возвращает распределение Стьюдента для заданного значения." },
	{ name: "T.DIST.2T(A1; B2)", description: "Возвращает двухстороннее распределение Стьюдента." },
	{ name: "T.DIST.RT(A1; B2)", description: "Возвращает одностороннее распределение Стьюдента." },
	{
		name: "T.INV(A1; B2)",
		description: "Возвращает обратное распределение Стьюдента для заданного уровня вероятности.",
	},
	{ name: "T.INV.2T(A1; B2)", description: "Возвращает обратное двухстороннее распределение Стьюдента." },
	{ name: "TAN(A1)", description: "Возвращает тангенс угла в радианах." },
	{ name: "TANH(A1)", description: "Возвращает гиперболический тангенс угла." },
	{ name: "TEXT(A1; B2)", description: "Применяет форматирование к числовым данным." },
	{ name: "TIME(A1; B2)", description: "Возвращает время, основанное на заданных часах, минутах и секундах." },
	{ name: "TIMEVALUE(A1; B2)", description: "Преобразует текстовое значение времени в числовое." },
	{ name: "TODAY()", description: "Возвращает текущую дату." },
	{ name: "TRANSPOSE(A1; B2)", description: "Меняет строки и столбцы местами в массиве." },
	{ name: "TRIM(A1)", description: "Удаляет лишние пробелы из текста, оставляя только один между словами." },
	{ name: "TRUE()", description: "Возвращает логическое значение ИСТИНА." },
	{ name: "TRUNC(A1; B2)", description: "Обрезает число до целого, удаляя дробную часть." },
	{ name: "TYPE(A1)", description: "Возвращает тип данных значения." },
	{ name: "UNICHAR(A1)", description: "Возвращает символ Unicode по заданному коду." },
	{ name: "UNICODE(A1)", description: "Возвращает код Unicode первого символа текста." },
	{ name: "VLOOKUP(A1; B2; C2; [range_lookup])", description: "Ищет значение в таблице по столбцу." },
	{ name: "WEBSERVICE(A1)", description: "Получает данные из веб-сервиса." },
	{ name: "WEEKDAY(A1; [return_type])", description: "Возвращает день недели для даты." },
	{ name: "WEEKNUM(A1; [return_type])", description: "Возвращает номер недели в году для заданной даты." },
	{ name: "WEIBULL.DIST(A1; B2; C2; [cumulative])", description: "Возвращает распределение Вейбулла." },
	{ name: "WORKDAY(A1; B2; [holidays])", description: "Возвращает дату, с учетом рабочих дней." },
	{
		name: "WORKDAY.INTL(A1; B2; [weekend]; [holidays])",
		description: "Возвращает дату, с учетом рабочих дней и выходных.",
	},
	{ name: "XOR(A1; B2)", description: "Возвращает логическое исключающее ИЛИ для двух значений." },
	{ name: "YEAR(A1)", description: "Возвращает год из даты." },
	{ name: "YEARFRAC(A1; B2)", description: "Возвращает дробную часть года между двумя датами." },
];

const ExcelFormulasModal: React.FC = () => {
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearchChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
		setSearchTerm(newValue || "");
	};

	const filteredFormulas = formulasHelpText.filter(
		(formula) =>
			formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			formula.description.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<Dialog>
			<DialogTrigger>
				<Button appearance="subtle" icon={<DocumentQuestionMarkRegular />} />
			</DialogTrigger>
			<DialogSurface>
				<DialogBody>
					<DialogTitle>Помощь по формулам</DialogTitle>
					<DialogContent style={{ maxHeight: "400px", overflowY: "auto" }}>
						<TextField
							label="Поиск формул"
							value={searchTerm}
							onChange={handleSearchChange}
							styles={{ root: { marginBottom: "15px" } }}
						/>
						<p>
							Здесь вы можете редактировать файл Excel. Если у вас есть вопросы по формулам, обратитесь к следующему
							списку:
						</p>
						<ul style={{ listStyleType: "none", padding: 0 }}>
							{filteredFormulas.map((formula, index) => (
								<li
									key={index}
									style={{
										marginBottom: "10px",
										borderBottom: "1px solid #ddd",
										paddingBottom: "5px",
									}}
								>
									<b>{formula.name}</b>: {formula.description}
								</li>
							))}
						</ul>
					</DialogContent>
				</DialogBody>
			</DialogSurface>
		</Dialog>
	);
};

export default ExcelFormulasModal;
