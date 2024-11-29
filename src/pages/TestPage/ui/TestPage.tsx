import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/shared/api/hooks/useAuthStore";
import { useEmployeeStore } from "@/shared/api/hooks/useEmployeeStore";
import { useExcelStore } from "@/shared/api/hooks/useExcelStore";
import { useSocketStore } from "@/shared/api/hooks/useSocketStore";
import { Button, Text, Input } from '@fluentui/react-components';

const TestPage = () => {
  const { login, user, isAuthenticated } = useAuthStore();
  const { getEmployees, getEmployeeProfile, employees, currentEmployee } = useEmployeeStore();
  const { getExcelFiles, downloadExcelFile, excelFiles } = useExcelStore();
  const { connectToSocket, listenToExcelUpdates, excelFiles: socketExcelFiles } = useSocketStore();

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    connectToSocket();
    listenToExcelUpdates();
  }, [connectToSocket, listenToExcelUpdates]);

  const handleLogin = async () => {
    try {
      await login(email, password);
      setToastMessage("Вход успешен");
      setToastType("success");
      setToastVisible(true);
    } catch (e: unknown) {
      const errorMessage = (e as Error).message;
      setToastMessage(`Ошибка при входе: ${errorMessage}`);
      setToastType("error");
      setToastVisible(true);
    }
  };

  const handleGetEmployees = async () => {
    try {
      await getEmployees();
      setToastMessage("Список сотрудников получен");
      setToastType("success");
      setToastVisible(true);
    } catch (e: unknown) {
      const errorMessage = (e as Error).message;
      setToastMessage(`Ошибка при получении сотрудников: ${errorMessage}`);
      setToastType("error");
      setToastVisible(true);
    }
  };

  const handleGetEmployeeProfile = async (id: string) => {
    try {
      await getEmployeeProfile(id);
      setToastMessage(`Профиль сотрудника ${id} получен`);
      setToastType("success");
      setToastVisible(true);
    } catch (e: unknown) {
      const errorMessage = (e as Error).message;
      setToastMessage(`Ошибка при получении профиля сотрудника: ${errorMessage}`);
      setToastType("error");
      setToastVisible(true);
    }
  };

  const handleDownloadExcelFile = async (id: string) => {
    try {
      await downloadExcelFile(id);
      setToastMessage("Файл Excel скачан");
      setToastType("success");
      setToastVisible(true);
    } catch (e: unknown) {
      const errorMessage = (e as Error).message;
      setToastMessage(`Ошибка при скачивании Excel файла: ${errorMessage}`);
      setToastType("error");
      setToastVisible(true);
    }
  };

  const handleGetExcelFiles = async () => {
    try {
      await getExcelFiles();
      setToastMessage("Список Excel файлов получен");
      setToastType("success");
      setToastVisible(true);
    } catch (e: unknown) {
      const errorMessage = (e as Error).message;
      setToastMessage(`Ошибка при получении Excel файлов: ${errorMessage}`);
      setToastType("error");
      setToastVisible(true);
    }
  };

  const handleCloseToast = () => {
    setToastVisible(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Страница тестирования API</h1>

      {toastVisible && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: toastType === "error" ? "yellow" : toastType === "success" ? "green" : "blue",
          color: "black",
          padding: "10px 20px",
          borderRadius: "5px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <Text style={{ marginRight: "10px" }}>{toastMessage}</Text>
          <Button onClick={handleCloseToast} style={{ color: "black" }}>Закрыть</Button>
        </div>
      )}

      <div style={{ marginBottom: "30px" }}>
        <h2>Тестирование авторизации (вход)</h2>
        <div style={{ marginBottom: "10px" }}>
          <Input
            value={email}
            onChange={(e, data) => setEmail(data.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <Input
            type="password"
            value={password}
            onChange={(e, data) => setPassword(data.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <Button onClick={handleLogin} style={{ width: "100%" }}>Войти (с тестовыми данными)</Button>
        {isAuthenticated ? (
          <Text style={{ marginTop: "10px" }}>Вошли как: {user?.email}</Text>
        ) : (
          <Text style={{ marginTop: "10px" }}>Войди, чтобы протестировать другие запросы API.</Text>
        )}
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>Тестирование сотрудников</h2>
        <Button onClick={handleGetEmployees} style={{ marginBottom: "20px" }}>Получить список сотрудников</Button>
        {employees && employees.length > 0 ? (
          <ul>
            {employees.map((employee) => (
              <li key={employee.id}>
                {employee.firstName} {employee.lastName} - {employee.position}
              </li>
            ))}
          </ul>
        ) : (
          <Text>Сотрудники не найдены.</Text>
        )}
        <br />
        <Button onClick={() => handleGetEmployeeProfile("1")}>Получить профиль сотрудника (ID: 1)</Button>
        {currentEmployee && (
          <div style={{ marginTop: "20px" }}>
            <h3>Профиль сотрудника</h3>
            <Text>Имя: {currentEmployee.firstName} {currentEmployee.lastName}</Text>
            <Text>Email: {currentEmployee.email}</Text>
            <Text>Должность: {currentEmployee.position}</Text>
            <Text>Отдел: {currentEmployee.department}</Text>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>Тестирование Excel файлов</h2>
        <Button onClick={handleGetExcelFiles} style={{ marginBottom: "20px" }}>Получить список Excel файлов</Button>
        {excelFiles && excelFiles.length > 0 ? (
          <ul>
            {excelFiles.map((file) => (
              <li key={file.id}>
                {file.name}{" "}
                <Button onClick={() => handleDownloadExcelFile(file.id)}>Скачать</Button>
              </li>
            ))}
          </ul>
        ) : (
          <Text>Excel файлы не найдены.</Text>
        )}
      </div>

      <div>
        <Text>Тестирование сокетов (Обновления в реальном времени)</Text>
        {socketExcelFiles && socketExcelFiles.length > 0 ? (
          <ul>
            {socketExcelFiles.map((file) => (
              <li key={file.id}>{file.name}</li>
            ))}
          </ul>
        ) : (
          <Text>Обновления еще не получены.</Text>
        )}
      </div>
    </div>
  );
};

export default TestPage;
