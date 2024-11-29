import { Employee } from "./Employee";

export interface ExcelFile {
  id: string;
  name: string;
  url: string;
  lastModified: string;
  creator: Employee
}