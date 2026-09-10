import { useEffect, useState } from "react";

export function useOnVisible(onVisible: () => void, enabled: boolean) {
    const [target, setTarget] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (target === null || !enabled) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    onVisible();
                }
            },
            { rootMargin: "500px" },
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [target, onVisible, enabled]);

    return setTarget;
}
