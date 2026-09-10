// Static content shown to reproduce the design handoff where the API has no route yet:
// weather, meetups, the user's pets, the profile tabs. Nothing here is fetched or saved,
// and every control built on it is inert (see Inert in shared/components/Inert.tsx).

export const SOON = "Bientôt disponible";

export type Species = "dog" | "cat";

export const NAV_ITEMS: { label: string; icon: "trail" | "collar" | "bark" | "ball" | "bone" | "health"; tint: string; badge?: string }[] = [
  { label: "Découvrir", icon: "trail", tint: "text-pc-accent" },
  { label: "Meutes", icon: "collar", tint: "text-pc-forest" },
  { label: "Aboiements", icon: "bark", tint: "text-pc-accent", badge: "4" },
  { label: "Rencontres", icon: "ball", tint: "text-pc-sagetext" },
  { label: "Enregistrés", icon: "bone", tint: "text-pc-muted" },
  { label: "Carnet de santé", icon: "health", tint: "text-pc-ink" },
];

export const MY_PETS: { name: string; breed: string; species: Species; tint: string }[] = [
  { name: "Biscuit", breed: "Golden Retriever", species: "dog", tint: "text-pc-forest" },
  { name: "Mochi", breed: "Shiba Inu", species: "dog", tint: "text-pc-accent" },
  { name: "Pip", breed: "Chat tigré", species: "cat", tint: "text-pc-muted" },
  { name: "Clover", breed: "Border Collie", species: "dog", tint: "text-pc-sagetext" },
  { name: "Kiwi", breed: "Chat européen", species: "cat", tint: "text-pc-accent" },
];

export const WEATHER = {
  now: "21°",
  summary: "Ensoleillé · Brooklyn",
  advice: "Temps parfait pour la promenade.",
  forecast: [
    { hour: "Maint.", temp: "21°", icon: "sun", tint: "text-[#e8871e]" },
    { hour: "14h", temp: "23°", icon: "suncloud", tint: "text-[#b4681a]" },
    { hour: "17h", temp: "20°", icon: "cloud", tint: "text-[#5e7350]" },
    { hour: "20h", temp: "17°", icon: "rain", tint: "text-[#2c5530]" },
  ] as const,
};

export const MEETUPS = [
  { day: "12", month: "sept.", place: "Prospect Park, grande prairie", going: "18 chiens inscrits · 9h" },
  { day: "14", month: "sept.", place: "Parc à chiens de Hoyt Street", going: "7 chiens inscrits · 18h" },
  { day: "19", month: "sept.", place: "Rencontre chatons, Fort Greene", going: "9 chats inscrits · 11h" },
];

export const PROFILE_TABS = ["Meute", "Étapes", "Rencontres", "À propos"];

export const PET_CARDS: {
  name: string;
  breed: string;
  age: string;
  trait: string;
  followers: string;
  species: Species;
  bg: string;
  ink: string;
  muted: string;
  accent: string;
}[] = [
  { name: "Biscuit", breed: "Golden Retriever · adopté en 2025", age: "1 an 4 mois", trait: "Ne rapporte rien", followers: "12,4k abonnés", species: "dog", bg: "bg-pc-sage", ink: "text-pc-forest2", muted: "text-pc-sagetext", accent: "text-pc-forest" },
  { name: "Mochi", breed: "Shiba Inu · recueilli", age: "3 ans", trait: "Voleur de chaussettes", followers: "5,8k abonnés", species: "dog", bg: "bg-pc-amber", ink: "text-pc-ink", muted: "text-pc-amber-text", accent: "text-pc-accent" },
  { name: "Pip", breed: "Chat tigré · trouvé dans un carton", age: "6 ans", trait: "Royauté du radiateur", followers: "2,1k abonnés", species: "cat", bg: "bg-pc-sand2", ink: "text-pc-ink", muted: "text-pc-body2", accent: "text-pc-sagetext" },
  { name: "Clover", breed: "Border Collie · voleur d'herbes", age: "2 ans", trait: "A mangé le basilic", followers: "1,4k abonnés", species: "dog", bg: "bg-pc-sage2", ink: "text-pc-forest2", muted: "text-pc-sagetext", accent: "text-pc-forest" },
  { name: "Kiwi", breed: "Chat européen · bruyant à 6h", age: "4 ans", trait: "Témoin de tout", followers: "980 abonnés", species: "cat", bg: "bg-pc-surface2", ink: "text-pc-ink", muted: "text-pc-body2", accent: "text-pc-accent" },
];
