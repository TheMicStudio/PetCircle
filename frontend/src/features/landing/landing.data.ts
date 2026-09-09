import type { JoinStat, NavLink, ServiceCard, StarProfile } from './landing.type';

/** Every asset of the landing lives in public/landing. */
export const LANDING_ASSETS = {
    logo: '/landing/logo-petcircle.png',
    cat: '/landing/cat.png',
    dogVideo: '/landing/dog.mp4',
    dogLoopVideo: '/landing/dog-loop.mp4',
    standingDog: '/landing/slot-dog-standing.webp',
} as const;

export const NAV_LINKS: readonly NavLink[] = [
    { label: 'Explorer', href: '#services' },
    { label: 'Comment ça marche', href: '#reseau' },
    { label: 'À propos', href: '#rejoindre' },
];

export const HERO_CATEGORIES: readonly string[] = [
    'Chiens',
    'Chats',
    'Lapins',
    'Oiseaux',
    'Rongeurs',
    'Reptiles',
];

export const SERVICE_CARDS: readonly ServiceCard[] = [
    {
        title: 'Créez le profil de votre animal',
        text: 'Photos, vidéos, humeur du jour : un espace à son image, que vous gérez pour lui.',
        linkLabel: 'Créer un profil',
        image: '/landing/slot-cat.webp',
        imageAlt: 'Un chiot creme couche',
        background: '#e4efd8',
    },
    {
        title: 'Suivez ceux que vous aimez',
        text: 'Un fil rempli de museaux, de bêtises et de siestes. Zéro pub, que des animaux.',
        linkLabel: 'Découvrir le fil',
        image: '/landing/slot-bags.webp',
        imageAlt: 'Un chien noir dans la neige',
        background: '#dcebd0',
    },
];

export const STAR_PROFILES: readonly StarProfile[] = [
    {
        rank: 'N°1',
        name: 'Biscuit',
        meta: 'Ara · Lyon',
        followers: '12,4k',
        image: '/landing/slot-p1.webp',
    },
    {
        rank: 'N°2',
        name: 'Mochi',
        meta: 'Hamster · Paris',
        followers: '9,8k',
        image: '/landing/slot-p2.webp',
    },
    {
        rank: 'N°3',
        name: 'Nala',
        meta: 'British shorthair · Nantes',
        followers: '7,1k',
        image: '/landing/slot-p3.webp',
    },
];

export const JOIN_STATS: readonly JoinStat[] = [
    { label: 'animaux', value: '40k', count: 40000, format: 'k' },
    { label: 'publications', value: '1,2M', count: 1200000, format: 'M' },
    { label: 'villes', value: '380', count: 380, format: 'plain' },
    { label: 'publicité', value: '0', count: null, format: 'plain' },
];
