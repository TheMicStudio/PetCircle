import { Link } from "react-router-dom";
import type { PublicUser } from "@petcircle/contracts";
import { Avatar } from "../../shared/components/Avatar";
import { FollowButton } from "./followButton";
import { useFollow } from "./useFollows";

// One suggestion of the discovery rail, mounted once the real follow state is known
export const FollowSuggestion = ({ profile }: { profile: PublicUser }) => {
  const follow = useFollow({
    userId: profile.id,
    followedByMe: profile.followedByMe,
    followerCount: profile.followerCount,
  });

  return (
    <li className="flex items-center gap-3">
      <Avatar size="sm" username={profile.username} />
      <div className="min-w-0 flex-1">
        <Link
          className="block truncate text-[0.84375rem] font-bold text-pc-ink no-underline hover:underline hover:underline-offset-2"
          to={`/profile/${profile.id}`}
        >
          {profile.username}
        </Link>
        <div className="mt-1 truncate text-[0.71875rem] text-pc-muted">
          {profile.postCount} post{profile.postCount > 1 ? "s" : ""} · {follow.count} abonné{follow.count > 1 ? "s" : ""}
        </div>
      </div>
      <FollowButton following={follow.following} error={follow.error} onToggle={follow.toggle} size="sm" />
    </li>
  );
};
