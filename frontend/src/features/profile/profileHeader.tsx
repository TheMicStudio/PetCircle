import type { PublicUser } from "@petcircle/contracts";
import { FollowButton } from "../follow/followButton";
import { useFollow } from "../follow/useFollows";
import { Avatar } from "../../shared/components/Avatar";
import { Inert } from "../../shared/components/Inert";
import { CollarIcon, DogHeadIcon, PawIcon, PinIcon, TrailIcon } from "../../shared/components/icons";
import { formatMonthYear } from "../../shared/formatDate";
import { CITY, PROFILE_BIO } from "../../shared/showcase";

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
        <div className="relative shrink-0 rounded-full bg-pc-page p-1.5">
          <Avatar size="lg" username={profile.username} />
          <span className="absolute right-1.5 bottom-1.5 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-pc-forest text-pc-surface">
            <DogHeadIcon size={20} />
          </span>
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
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-pc-dot" />
            <span className="flex items-center gap-1.5 text-[0.84375rem] text-pc-muted">
              <PinIcon />
              {CITY}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pb-3">
          {isOwner ? (
            <Inert className="flex items-center gap-2 rounded-[0.75rem] bg-pc-cta px-5 py-3.5 text-[0.84375rem] font-bold text-pc-ink transition-colors hover:bg-pc-cta2">
              <CollarIcon />
              Modifier le profil
            </Inert>
          ) : (
            <FollowButton following={follow.following} error={follow.error} onToggle={follow.toggle} />
          )}
          <Inert aria-label="Partager ce profil" className="flex rounded-[0.75rem] bg-pc-sand p-3.5 text-pc-body transition-colors hover:bg-pc-hover2 hover:text-pc-ink">
            <TrailIcon />
          </Inert>
        </div>
      </div>

      {/* the followers count comes from the hook, it changes as soon as you follow */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-[clamp(1.5rem,5vw,3.5rem)] rounded-[1.125rem] bg-pc-sand2 px-[clamp(1.25rem,3vw,2.5rem)] py-[clamp(1.5rem,3.4vw,2.375rem)]">
        <div className="min-w-0 max-w-[56ch] flex-[1_1_21rem]">
          <p className="font-display text-[clamp(1rem,2vw,1.1875rem)] leading-[1.6] text-pc-ink2">{PROFILE_BIO}</p>
          <div className="mt-4 flex items-center gap-2.5">
            <Avatar className="h-7 w-7 text-[0.75rem]" size="sm" username={profile.username} />
            <span className="text-[0.84375rem] text-pc-muted">
              Avec <span className="font-semibold text-pc-body">{profile.username}</span> · inscrit en {formatMonthYear(profile.createdAt)}
            </span>
          </div>
        </div>
        <dl className="flex flex-[1_1_18rem] flex-wrap justify-center gap-[clamp(1.25rem,4vw,2.75rem)]">
          <Stat label="Posts" value={profile.postCount} />
          <Stat label="Abonnés" value={follow.count} />
          <Stat label="Abonnements" value={profile.followingCount} />
        </dl>
      </div>
    </header>
  );
};
