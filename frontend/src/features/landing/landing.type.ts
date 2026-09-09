// Types of the landing page content. Data only, no HTTP here.

export interface NavLink {
    label: string;
    href: string;
}

export interface ServiceCard {
    title: string;
    text: string;
    linkLabel: string;
    image: string;
    imageAlt: string;
    background: string;
}

export interface StarProfile {
    rank: string;
    name: string;
    meta: string;
    followers: string;
    image: string;
}

/** Number that counts up when the section enters the screen. */
export interface JoinStat {
    label: string;
    value: string;
    count: number | null;
    format: CountFormat;
}

export type CountFormat = 'k' | 'M' | 'plain';
