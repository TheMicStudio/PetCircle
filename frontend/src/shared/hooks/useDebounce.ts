import { useEffect, useState } from "react";

// Renvoie la valeur seulement quand elle a arrete de bouger pendant delay.
export function useDebounce<T>(value: T, delay: number): T {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debounceValue;
}