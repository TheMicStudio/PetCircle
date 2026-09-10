import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../../features/auth/session";
import { Avatar } from "./Avatar";
import { Brand } from "./Brand";
import { Inert } from "./Inert";
import { BarkIcon, BellIcon, ChevronIcon, SniffIcon } from "./icons";

const iconButton = "flex rounded-[0.625rem] p-2.5 text-pc-body2 transition-colors hover:bg-pc-hover hover:text-pc-ink";

// Sticky top bar shared by every signed in page. The leading slot holds a rail toggle or a back
// link, the trailing one sits after the user pill. Search, alerts and messages are design only.
export const AppHeader = ({ leading, trailing, search = false }: { leading?: ReactNode; trailing?: ReactNode; search?: boolean }) => {
  const { user } = useSession();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 bg-pc-page px-4 py-3.5 sm:gap-5 sm:px-[clamp(1rem,3vw,2.125rem)]">
      {leading}
      <Brand />

      {search && (
        <div className="hidden min-w-0 max-w-[23.75rem] flex-[1_1_8.75rem] items-center gap-2.5 rounded-[0.6875rem] bg-pc-sand px-3.5 py-2.5 text-pc-muted2 md:flex">
          <SniffIcon />
          <input
            aria-label="Chercher"
            className="min-w-0 flex-1 cursor-default border-none bg-transparent text-[0.875rem] text-pc-ink outline-none placeholder:text-pc-faint"
            placeholder="Chercher un animal, une race, une meute"
            readOnly
            title="Bientôt disponible"
          />
        </div>
      )}

      <div className="ml-auto flex items-center gap-1">
        <Inert aria-label="Notifications" className={`relative ${iconButton}`}>
          <BellIcon />
          <span aria-hidden="true" className="absolute top-2 right-2 h-[7px] w-[7px] rounded-full bg-pc-accent" />
        </Inert>
        <Inert aria-label="Messages" className={`hidden sm:flex ${iconButton}`}>
          <BarkIcon />
        </Inert>

        {user !== null && (
          <Link
            className="ml-2 flex items-center gap-2 rounded-full bg-pc-sand p-1 no-underline transition-colors hover:bg-pc-hover2 sm:pr-3"
            to={`/profile/${user.id}`}
          >
            <Avatar size="sm" username={user.username} />
            <span className="hidden text-[0.8125rem] font-semibold text-pc-ink sm:inline">{user.username}</span>
            <ChevronIcon className="hidden text-pc-muted2 sm:block" />
          </Link>
        )}
        {trailing !== undefined && <span className="ml-1 flex">{trailing}</span>}
      </div>
    </header>
  );
};
