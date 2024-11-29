import { create } from "zustand";
import { Theme } from "../types/Theme";
import { Languages } from "../types/Languages";

type State = {
	theme: Theme;
	language: Languages;
};

type Action = {
	setTheme: (theme: Theme) => void;
	setLanguage: (language: Languages) => void;
};

export const useSystemStore = create<State & Action>((set) => ({
	language: "ru",
	theme: "light",
	setLanguage: (language) => set(() => ({ language })),
	setTheme: (theme) => set(() => ({ theme })),
}));
