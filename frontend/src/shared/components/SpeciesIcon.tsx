import { CatHeadIcon, DogHeadIcon } from "./icons";
import type { Species } from "../showcase";

export const SpeciesIcon = ({ species, size, className }: { species: Species; size?: number; className?: string }) =>
  species === "cat" ? <CatHeadIcon className={className} size={size ?? 13} /> : <DogHeadIcon className={className} size={size ?? 14} />;
