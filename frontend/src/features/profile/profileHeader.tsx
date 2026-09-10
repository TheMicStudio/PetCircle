import { Link } from "react-router-dom";
import type { PublicUser } from "@petcircle/contracts";
import { FollowButton } from "../follow/followButton";
import { useFollow } from "../follow/useFollows";
import { Avatar } from "../../shared/components/Avatar";
import { CollarIcon, PawIcon } from "../../shared/components/icons";
import { formatMonthYear } from "../../shared/formatDate";

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col-reverse text-center">
    <dt className="mt-2 text-[0.6875rem] font-semibold tracking-[0.12em] text-pc-muted uppercase">{label}</dt>
    <dd className="font-display text-[clamp(1.625rem,3.4vw,2.125rem)] leading-none font-semibold tracking-[-0.02em] text-pc-ink tabular-nums">
      {value}
    </dd>
  </div>
);

// mounted only once the profile is loaded, so useFollow starts with the real values
export const ProfileHeader = ({ profile, isOwner }: { profile: PublicUser; isOwner: boolean }) => {
  const follow = useFollow({
    userId: profile.id,
    followedByMe: profile.followedByMe,
    followerCount: profile.followerCount,
  });

  return (
    <header>
      {/* no cover pictures in the API, the band stays a plain sage block. An explicit height, an aspect ratio with a min-height would widen it on mobile */}
      <div className="relative flex h-[11.25rem] items-end justify-end overflow-hidden rounded-[1.125rem] bg-pc-sage2 p-6 sm:h-[clamp(11.25rem,25vw,21rem)]">
        <PawIcon className="text-pc-forest opacity-[0.12]" size={140} />
      </div>

      <div className="relative z-[2] mt-[clamp(-4rem,-6vw,-2.5rem)] flex flex-col items-center gap-4 px-2 text-center sm:flex-row sm:flex-wrap sm:items-end sm:gap-[clamp(1rem,2.6vw,1.75rem)] sm:px-[clamp(0.5rem,2vw,1.375rem)] sm:text-left">
        <div className="shrink-0 rounded-full bg-pc-page p-1.5">
          <Avatar size="lg" username={profile.username} />
        </div>

        <div className="min-w-0 pb-2.5 sm:flex-[1_1_17.5rem]">
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] leading-none font-semibold tracking-[-0.03em] text-pc-ink">
            {profile.username}
          </h1>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
            <span className="text-[0.875rem] font-semibold text-pc-accent">@{profile.username}</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-pc-dot" />
            <span className="text-[0.84375rem] text-pc-muted">
              {isOwner ? "Membre" : "Inscrit"} depuis {formatMonthYear(profile.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pb-3">
          {isOwner ? (
            <Link
              className="flex items-center gap-2 rounded-[0.75rem] bg-pc-cta px-5 py-3.5 text-[0.84375rem] font-bold text-pc-ink no-underline transition-colors hover:bg-pc-cta2"
              to="/feed"
            >
              <CollarIcon />
              Publier un post
            </Link>
          ) : (
            <FollowButton following={follow.following} error={follow.error} onToggle={follow.toggle} />
          )}
        </div>
      </div>

      {/* the followers count comes from the hook, it changes as soon as you follow */}
      <dl className="mt-7 flex flex-wrap justify-center gap-[clamp(1.5rem,5vw,3.5rem)] rounded-[1.125rem] bg-pc-sand2 px-6 py-[clamp(1.5rem,3.4vw,2.375rem)]">
        <Stat label="Posts" value={profile.postCount} />
        <Stat label="Abonnés" value={follow.count} />
        <Stat label="Abonnements" value={profile.followingCount} />
      </dl>
    </header>
  );
};
