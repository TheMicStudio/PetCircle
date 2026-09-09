import { useEffect } from 'react';
import type { CountFormat } from './landing.type';

/** Format a counter value the same way the design does. */
function formatCount(value: number, format: CountFormat): string {
    if (format === 'k') {
        return Math.round(value / 1000) + 'k';
    }
    if (format === 'M') {
        return (value / 1e6).toFixed(1).replace('.', ',') + 'M';
    }
    return String(Math.round(value));
}

function isCountFormat(value: string | undefined): value is CountFormat {
    return value === 'k' || value === 'M' || value === 'plain';
}

/** Animate a number from 0 to its target in 1.4s. */
function countUp(element: HTMLElement): void {
    const target = Number(element.dataset.count);
    const format = element.dataset.fmt;
    if (!Number.isFinite(target) || !isCountFormat(format)) {
        return;
    }
    let startedAt = 0;
    const step = (now: number): void => {
        startedAt = startedAt === 0 ? now : startedAt;
        const progress = Math.min(1, Math.max(0, (now - startedAt) / 1400));
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = formatCount(target * eased, format);
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
}

/**
 * Reveal every [data-reveal] element when it enters the screen, and start the
 * counters it contains. One observer for the whole page.
 */
export function useReveal(): void {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) {
                        continue;
                    }
                    const element = entry.target;
                    element.setAttribute('data-reveal', 'in');
                    element.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp);
                    observer.unobserve(element);
                }
            },
            { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
        );

        document
            .querySelectorAll<HTMLElement>('[data-reveal]:not([data-reveal="in"])')
            .forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, []);
}
