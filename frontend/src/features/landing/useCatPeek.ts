import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/**
 * Make the cat slide up from the bottom while the next section arrives.
 * The value is smoothed frame by frame so the move never jumps.
 */
export function useCatPeek(
    catRef: RefObject<HTMLImageElement | null>,
    anchorRef: RefObject<HTMLElement | null>,
): void {
    const currentRef = useRef<number>(0);
    const targetRef = useRef<number>(0);
    const frameRef = useRef<number>(0);

    useEffect(() => {
        const step = (): void => {
            frameRef.current = 0;
            const cat = catRef.current;
            if (cat === null) {
                return;
            }
            const target = targetRef.current;
            currentRef.current += (target - currentRef.current) * 0.14;
            if (Math.abs(target - currentRef.current) < 0.001) {
                currentRef.current = target;
            }
            const eased = currentRef.current;
            cat.style.transform =
                'translateY(' + (100 - eased * 58).toFixed(2) + '%) rotate(' + (-10 + eased * 10).toFixed(2) + 'deg)';
            if (currentRef.current !== target) {
                frameRef.current = requestAnimationFrame(step);
            }
        };

        const onScroll = (): void => {
            const anchor = anchorRef.current;
            if (anchor === null) {
                return;
            }
            const top = anchor.getBoundingClientRect().top;
            const viewHeight = window.innerHeight;
            const progress = Math.min(1, Math.max(0, (viewHeight * 0.9 - top) / (viewHeight * 0.4)));
            targetRef.current = 1 - Math.pow(1 - progress, 3);
            if (frameRef.current === 0) {
                frameRef.current = requestAnimationFrame(step);
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        return () => {
            window.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(frameRef.current);
            // React mounts the effect twice in StrictMode. Without this reset,
            // the guard in onScroll thinks a frame is already requested.
            frameRef.current = 0;
        };
    }, [anchorRef, catRef]);
}
