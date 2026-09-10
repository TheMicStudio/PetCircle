import { NavLink } from "react-router-dom";
import { Avatar } from "../../shared/components/Avatar";
import { Inert } from "../../shared/components/Inert";
import { SpeciesIcon } from "../../shared/components/SpeciesIcon";
import { BallIcon, BarkIcon, BoneIcon, CollarIcon, DenIcon, DogHeadIcon, HealthIcon, PlusIcon, TrailIcon } from "../../shared/components/icons";
import { MY_PETS, NAV_ITEMS } from "../../shared/showcase";
import { useSession } from "../auth/session";

const ICONS = {
  trail: TrailIcon,
  collar: CollarIcon,
  bark: BarkIcon,
  ball: BallIcon,
  bone: BoneIcon,
  health: HealthIcon,
};

const itemBase = "flex w-full items-center gap-3 rounded-[0.625rem] px-3.5 py-3 text-left text-[0.9375rem] no-underline transition-colors";
const itemIdle = "font-medium text-pc-body hover:bg-pc-hover hover:text-pc-ink";

// Left rail of the feed. Only "Fil" and "Mon profil" lead somewhere, the rest is the handoff design.
export const FeedRail = () => {
  const { user } = useSession();

  return (
    <>
      <nav aria-label="Principale" className="flex flex-col gap-0.5">
        <NavLink className={({ isActive }) => `${itemBase} ${isActive ? "bg-pc-sage font-bold text-pc-forest" : itemIdle}`} to="/feed">
          <DenIcon />
          Fil
        </NavLink>
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <Inert className={`${itemBase} ${itemIdle}`} key={item.label}>
              <Icon className={item.tint} size={18} />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.badge !== undefined && (
                <span className="flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-pc-cta px-1 text-[0.6875rem] font-bold text-pc-ink">
                  {item.badge}
                </span>
              )}
            </Inert>
          );
        })}
        {user !== null && (
          <NavLink className={({ isActive }) => `${itemBase} ${isActive ? "bg-pc-sage font-bold text-pc-forest" : itemIdle}`} to={`/profile/${user.id}`}>
            <DogHeadIcon className="text-pc-accent" size={18} />
            Mon profil
          </NavLink>
        )}
      </nav>

      <div>
        <div className="mx-2.5 mb-3 flex items-baseline justify-between">
          <span className="text-[0.6875rem] font-semibold tracking-[0.13em] text-pc-muted2 uppercase">Votre meute</span>
          <span className="text-[0.71875rem] text-pc-faint">{MY_PETS.length}</span>
        </div>
        <ul className="flex flex-col gap-[3px]">
          {MY_PETS.map((pet) => (
            <li key={pet.name}>
              <Inert className="flex w-full items-center gap-2.5 rounded-[0.625rem] px-2.5 py-1.5 text-left transition-colors hover:bg-pc-hover">
                <Avatar size="sm" username={pet.name} />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.84375rem] leading-[1.1] font-semibold text-pc-ink">{pet.name}</span>
                  <span className="mt-[3px] block truncate text-[0.71875rem] leading-[1.1] text-pc-muted2">{pet.breed}</span>
                </span>
                <SpeciesIcon className={pet.tint} species={pet.species} />
              </Inert>
            </li>
          ))}
          <li>
            <Inert className="flex w-full items-center gap-2.5 rounded-[0.625rem] px-2.5 py-2 text-left text-[0.84375rem] font-semibold text-pc-accent">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pc-amber">
                <PlusIcon />
              </span>
              Ajouter un animal
            </Inert>
          </li>
        </ul>
      </div>

      <p className="mt-auto px-2.5 text-[0.75rem] leading-[1.7] text-pc-muted2">
        PetCircle · Brooklyn
        <br />
        Pensé pour les animaux d'abord.
      </p>
    </>
  );
};
