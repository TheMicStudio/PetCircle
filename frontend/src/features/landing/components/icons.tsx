// Small icon set of the landing. Every icon follows the current text color
// unless a color is given.

interface IconProps {
    className?: string;
    color?: string;
    size?: number;
}

export function PawIcon({ className, color = 'currentColor' }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 40 40" fill={color} aria-hidden="true">
            <ellipse cx="9" cy="14" rx="5" ry="6" />
            <ellipse cx="31" cy="14" rx="5" ry="6" />
            <ellipse cx="15" cy="6" rx="4.5" ry="5.5" />
            <ellipse cx="25" cy="6" rx="4.5" ry="5.5" />
            <path d="M20 17c8 0 14 6 14 13 0 5-4 8-8 7-3-1-4-3-6-3s-3 2-6 3c-4 1-8-2-8-7 0-7 6-13 14-13z" />
        </svg>
    );
}

export function BoneIcon({ className, color = '#3a2012' }: IconProps) {
    return (
        <svg
            className={className}
            viewBox="0 0 80 40"
            fill="none"
            stroke={color}
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <path d="M22 15 C22 11 18 8 14 8 C9 8 6 12 7 16 C4 17 3 21 4 24 C5 29 10 31 14 30 C18 29 21 26 22 23 L58 23 C59 26 62 29 66 30 C70 31 75 29 76 24 C77 21 76 17 73 16 C74 12 71 8 66 8 C62 8 58 11 58 15 Z" />
        </svg>
    );
}

export function HeartIcon({ className, color = 'currentColor', size }: IconProps) {
    const filled = color === '#fff';
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? color : 'none'}
            stroke={filled ? 'none' : color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z" />
        </svg>
    );
}

export function SparklesIcon({ className, color = '#f2a41f' }: IconProps) {
    return (
        <svg className={className} viewBox="0 0 48 48" fill={color} aria-hidden="true">
            <path d="M14 4l2.6 7.4L24 14l-7.4 2.6L14 24l-2.6-7.4L4 14l7.4-2.6z" />
            <path d="M36 22l1.7 4.3L42 28l-4.3 1.7L36 34l-1.7-4.3L30 28l4.3-1.7z" />
            <path d="M30 40l1 2.6 2.6 1-2.6 1-1 2.4-1-2.4-2.6-1 2.6-1z" />
        </svg>
    );
}

export function ArrowIcon({ className, color = 'currentColor', size = 14 }: IconProps) {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
    );
}

export function PlusIcon({ color = '#fff', size = 14 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2.6"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}
