import { create } from "zustand";
import { Employee } from "@/shared/types/Employee";
import { $api } from "@/shared/api/api";

interface EmployeeStore {
  employees: Employee[] | null;
  currentEmployee: Employee | null;
  getEmployees: () => Promise<void>;
  getEmployeeProfile: (id: string) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: null,
  currentEmployee: null,

  getEmployees: async () => {
    try {
      const res = await $api.get<Employee[]>("/employees");
      if (res.status === 200) {
        set({ employees: res.data });
      }
    } catch (e) {
      console.error("Error fetching employees:", e);
    }
  },

  getEmployeeProfile: async (id: string) => {
    try {
      const res = await $api.get<Employee>(`/employees/${id}`);
      if (res.status === 200) {
        set({ currentEmployee: res.data });
      }
    } catch (e) {
      console.error("Error fetching employee profile:", e);
    }
  }
}));
