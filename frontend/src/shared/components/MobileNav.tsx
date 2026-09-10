import { NavLink } from "react-router-dom";
import { useSession } from "../../features/auth/session";
import { Inert } from "./Inert";
import { BarkIcon, CollarIcon, DenIcon, DogHeadIcon, TrailIcon } from "./icons";

const base = "flex min-h-11 flex-1 flex-col items-center justify-center gap-1.5 rounded-[0.625rem] px-0.5 py-1.5 text-[0.625rem] font-semibold no-underline";
const itemClass = ({ isActive }: { isActive: boolean }): string => `${base} ${isActive ? "text-pc-accent" : "text-pc-body2"}`;

// Bottom bar of the handoff, phones only. Fil and Profil lead somewhere, the three others are design.
export const MobileNav = () => {
  const { user } = useSession();

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed inset-x-0 bottom-0 z-[75] flex items-center justify-around border-t border-solid border-pc-hair bg-pc-surface px-1.5 pt-2 pb-[calc(0.625rem+env(safe-area-inset-bottom))] sm:hidden"
    >
      <NavLink className={itemClass} to="/feed">
        <DenIcon size={20} />
        Fil
      </NavLink>
      <Inert className={`${base} text-pc-body2`}>
        <TrailIcon size={20} />
        Découvrir
      </Inert>
      <Inert className={`${base} text-pc-body2`}>
        <CollarIcon size={20} />
        Meutes
      </Inert>
      <Inert className={`${base} text-pc-body2`}>
        <BarkIcon size={20} />
        Aboiements
      </Inert>
      {user !== null && (
        <NavLink className={itemClass} to={`/profile/${user.id}`}>
          <DogHeadIcon size={19} />
          Profil
        </NavLink>
      )}
    </nav>
  );
};
