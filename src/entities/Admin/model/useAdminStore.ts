import { Employee } from "@/shared/types/Employee";
import { ExcelFile } from "@/shared/types/ExcelFile";
import { v4 } from "uuid";
import { create } from "zustand";

export type PageType = "Новая вкладка" | "Пользователи" | "Таблицы";

interface Page {
	id: string;
	type: PageType;
	data: null | Employee[] | ExcelFile[];
}

interface State {
	pages: Page[];
	currentPage: Page | null;
	currentPageId: string | null;
	addPage: (type: PageType, id?: string) => void;
	setCurrentPage: (pageId: string) => void;
	removePage: (pageId: string) => void;
	setData: <T extends ExcelFile | Employee>(pageId: string, data: T[]) => void;
}

export const useAdminStore = create<State>((set, get) => ({
	pages: [],
	currentPage: null,
	currentPageId: null,

	addPage: (type, id = v4()) => {
		const { pages } = get();
		// Удаляем старую вкладку такого же типа, если она существует
		const filteredPages = pages.filter((page) => page.type !== type);

		// Создаем новую вкладку
		const newPage: Page = {
			id: `${id}`,
			type,
			data: null,
		};

		set({
			pages: [...filteredPages, newPage],
			currentPageId: newPage.id,
		});
	},

	removePage: (pageId) => set((store) => ({ pages: store.pages.filter((page) => page.id !== pageId) })),

	setCurrentPage: (pageId) =>
		set((store) => ({ currentPageId: pageId, currentPage: store.pages.find(({ id }) => id === pageId) })),

	setData: (pageId, data) =>
		// @ts-ignore
		set((state) => ({
			pages: state.pages.map((page) => (page.id === pageId ? { ...page, data: [...data] } : page)),
		})),
}));
