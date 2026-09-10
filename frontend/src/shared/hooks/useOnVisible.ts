import { useEffect, useState } from "react";

// returns a ref callback, not a ref object: state re-runs the effect once the
// node is mounted, a useRef mutation would not
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
            // fire 500px before the sentinel shows, the next page is ready in time
            { rootMargin: "500px" },
        );

        observer.observe(target);

        return () => observer.disconnect();
    }, [target, onVisible, enabled]);

    return setTarget;
}
