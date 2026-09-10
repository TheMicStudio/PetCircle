import { Link } from "react-router-dom";
import type { PublicUser } from "@petcircle/contracts";
import { FollowButton } from "../follow/followButton";
import { useFollow } from "../follow/useFollows";

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div>
    <dt className="text-[0.75rem] text-[#9e9e9e]">{label}</dt>
    <dd className="text-[1.125rem] font-medium text-[#111111] tabular-nums">{value}</dd>
  </div>
);

const formatDate = (iso: string): string => new Date(iso).toLocaleDateString("fr-FR");

// mounted only once the profile is loaded, so useFollow starts with the real values
export const ProfileHeader = ({ profile, isOwner }: { profile: PublicUser; isOwner: boolean }) => {
  const follow = useFollow({
    userId: profile.id,
    followedByMe: profile.followedByMe,
    followerCount: profile.followerCount,
  });

  return (
    <header className="mt-4 rounded-[0.75rem] border border-solid border-[#00000014] bg-white p-5 shadow-[0_1px_2px_#0000000d]">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-[1.5rem] font-semibold tracking-tight text-[#111111]">
          {isOwner ? "Mon profil" : profile.username}
        </h1>

        {isOwner ? (
          <Link
            className="text-[0.875rem] font-medium text-[#111111] underline underline-offset-2 hover:text-[#525252]"
            to="/feed"
          >
            Publier un post
          </Link>
        ) : (
          <FollowButton
            following={follow.following}
            error={follow.error}
            onToggle={follow.toggle}
          />
        )}
      </div>

      <p className="mt-1 text-[0.75rem] text-[#9e9e9e]">
        {isOwner ? `@${profile.username} — inscrit` : "Inscrit"} le {formatDate(profile.createdAt)}
      </p>

      {/* the followers count comes from the hook, it changes as soon as you follow */}
      <dl className="mt-4 flex gap-8 border-t border-solid border-[#00000014] pt-4">
        <Stat label="posts" value={profile.postCount} />
        <Stat label="abonnés" value={follow.count} />
        <Stat label="abonnements" value={profile.followingCount} />
      </dl>
    </header>
  );
};
