import React, { useState } from 'react';
import './App.css';  // Для добавления стилей

const App = () => {
  const [data, setData] = useState([
    [{ value: 'John', bold: false, italic: false, backgroundColor: '#fff' }, { value: 25, bold: false, italic: false, backgroundColor: '#fff' }, { value: 'Engineer', bold: false, italic: false, backgroundColor: '#fff' }],
    [{ value: 'Jane', bold: false, italic: false, backgroundColor: '#fff' }, { value: 30, bold: false, italic: false, backgroundColor: '#fff' }, { value: 'Designer', bold: false, italic: false, backgroundColor: '#fff' }],
    [{ value: 'Alice', bold: false, italic: false, backgroundColor: '#fff' }, { value: 22, bold: false, italic: false, backgroundColor: '#fff' }, { value: 'Developer', bold: false, italic: false, backgroundColor: '#fff' }],
  ]);
  
  const [selectedCells, setSelectedCells] = useState([]);
  const [cellStyle, setCellStyle] = useState({ backgroundColor: '#FFFF00', fontWeight: 'normal', fontStyle: 'normal' });
  const [editingCell, setEditingCell] = useState(null);  // Для отслеживания, какая ячейка редактируется
  const [activeStyles, setActiveStyles] = useState({ bold: false, italic: false });

  // Обработчик изменения данных в ячейках
  const handleCellChange = (row, column, newValue) => {
    const newData = [...data];
    newData[row][column].value = newValue;
    setData(newData);
  };

  // Обработчик одиночного клика (выбор ячейки)
  const handleCellClick = (row, column) => {
    if (selectedCells.findIndex(cell => cell.row === row && cell.column === column) === -1) {
      setSelectedCells([...selectedCells, { row, column }]);
      setEditingCell(null);  // При одиночном клике отменяем режим редактирования
    } else {
      setSelectedCells(selectedCells.filter(cell => !(cell.row === row && cell.column === column))); // Сбрасываем выбор при повторном клике
    }
  };

  // Обработчик двойного клика (редактирование текста)
  const handleCellDoubleClick = (row, column) => {
    setEditingCell({ row, column });  // Включаем режим редактирования для этой ячейки
  };

  // Применяем стиль к выбранным ячейкам
  const applyStyleToSelectedCells = () => {
    const updatedData = [...data];
    selectedCells.forEach(({ row, column }) => {
      updatedData[row][column].backgroundColor = cellStyle.backgroundColor;
      updatedData[row][column].fontWeight = cellStyle.fontWeight;
      updatedData[row][column].fontStyle = cellStyle.fontStyle;
    });
    setData(updatedData);
  };

  // Обработчик изменения цвета
  const handleColorChange = (color) => {
    setCellStyle((prevStyle) => ({
      ...prevStyle,
      backgroundColor: color,
    }));
  };

  // Обработчик изменения стиля текста (жирный, курсив)
  const toggleBold = () => {
    setActiveStyles((prev) => {
      const newBoldState = !prev.bold;
      setCellStyle((prevStyle) => ({
        ...prevStyle,
        fontWeight: newBoldState ? 'bold' : 'normal',
      }));
      return { ...prev, bold: newBoldState };
    });
  };

  const toggleItalic = () => {
    setActiveStyles((prev) => {
      const newItalicState = !prev.italic;
      setCellStyle((prevStyle) => ({
        ...prevStyle,
        fontStyle: newItalicState ? 'italic' : 'normal',
      }));
      return { ...prev, italic: newItalicState };
    });
  };

  const resetFontStyle = () => {
    setActiveStyles({ bold: false, italic: false });
    setCellStyle((prevStyle) => ({
      ...prevStyle,
      fontWeight: 'normal',
      fontStyle: 'normal',
    }));
  };

  // Отображаем таблицу
  const renderTable = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {data.map((rowData, rowIndex) => (
            <tr key={rowIndex}>
              {rowData.map((cellData, colIndex) => (
                <td
                  key={colIndex}
                  style={{
                    backgroundColor: cellData.backgroundColor,
                    border: selectedCells.some(
                      (cell) => cell.row === rowIndex && cell.column === colIndex
                    )
                      ? '2px solid blue'
                      : '1px solid black',
                    padding: '8px',
                    width: '150px',  // Фиксированная ширина ячеек
                    height: '50px',  // Фиксированная высота ячеек
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontWeight: cellData.fontWeight,
                    fontStyle: cellData.fontStyle,
                  }}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                >
                  {editingCell && editingCell.row === rowIndex && editingCell.column === colIndex ? (
                    <input
                      id={`cell-${rowIndex}-${colIndex}`}
                      type="text"
                      value={cellData.value}
                      onChange={(e) =>
                        handleCellChange(rowIndex, colIndex, e.target.value)
                      }
                      autoFocus
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        backgroundColor: cellData.backgroundColor,
                        fontWeight: cellData.fontWeight,
                        fontStyle: cellData.fontStyle,
                        padding: '8px',
                        textAlign: 'center',
                      }}
                    />
                  ) : (
                    cellData.value
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h1>Excel-like Table with Multiple Cell Selection and Formatting</h1>
      
      {/* Меню выбора цвета и стилей */}
      <div style={{ marginBottom: '20px' }}>
        <label>Select Cell Color: </label>
        <input
          type="color"
          value={cellStyle.backgroundColor}
          onChange={(e) => handleColorChange(e.target.value)}
        />
        
        {/* Кнопки для жирного и курсивного текста */}
        <button
          onClick={toggleBold}
          style={{
            fontWeight: 'bold',
            backgroundColor: activeStyles.bold ? '#007BFF' : '#f0f0f0',
            color: activeStyles.bold ? 'white' : 'black',
            border: '1px solid #ddd',
            padding: '5px 10px',
            marginLeft: '10px',
            cursor: 'pointer',
          }}
        >
          B
        </button>

        <button
          onClick={toggleItalic}
          style={{
            fontStyle: 'italic',
            backgroundColor: activeStyles.italic ? '#007BFF' : '#f0f0f0',
            color: activeStyles.italic ? 'white' : 'black',
            border: '1px solid #ddd',
            padding: '5px 10px',
            marginLeft: '10px',
            cursor: 'pointer',
          }}
        >
          I
        </button>

        {/* Кнопка для сброса стиля шрифта */}
        <button
          onClick={resetFontStyle}
          style={{
            backgroundColor: '#f0f0f0',
            color: 'black',
            border: '1px solid #ddd',
            padding: '5px 10px',
            marginLeft: '10px',
            cursor: 'pointer',
          }}
        >
          Normal
        </button>

        <button 
        onClick={applyStyleToSelectedCells}
        style={{
          backgroundColor: '#f0f0f0',
          color: 'black',
          border: '1px solid #ddd',
          padding: '5px 10px',
          marginLeft: '10px',
          cursor: 'pointer',
        }}>Apply Style</button>
      </div>

      {/* Отображение таблицы */}
      {renderTable()}
    </div>
  );
};

export default App;
