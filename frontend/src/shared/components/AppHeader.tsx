import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useSession } from "../../features/auth/session";
import { Avatar } from "./Avatar";
import { Brand } from "./Brand";
import { ChevronIcon } from "./icons";

// Sticky top bar shared by every signed in page. The leading slot holds a rail toggle or a back link.
export const AppHeader = ({ leading }: { leading?: ReactNode }) => {
  const { user } = useSession();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 bg-pc-page px-4 py-3.5 sm:gap-5 sm:px-[clamp(1rem,3vw,2.125rem)]">
      {leading}
      <Brand />

      {user !== null && (
        <Link
          className="ml-auto flex items-center gap-2 rounded-full bg-pc-sand p-1 no-underline transition-colors hover:bg-pc-hover2 sm:pr-3"
          to={`/profile/${user.id}`}
        >
          <Avatar size="sm" username={user.username} />
          <span className="hidden text-[0.8125rem] font-semibold text-pc-ink sm:inline">{user.username}</span>
          <ChevronIcon className="hidden text-pc-muted2 sm:block" />
        </Link>
      )}
    </header>
  );
};
