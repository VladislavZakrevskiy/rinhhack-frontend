import { useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const debouncedFn = (...args: any[]) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			console.log("useDbounce");
			fn(...args);
		}, delay);
	};

	return debouncedFn as T;
}
