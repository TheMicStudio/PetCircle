import type { PublicUser } from "@petcircle/contracts";
import { useSession } from "../auth/session";
import { useGetProfile } from "../profile/useProfile";
import { FollowButton } from "./followButton";
import { useFollow } from "./useFollows";

const Button = ({ profile }: { profile: PublicUser }) => {
  const follow = useFollow({
    userId: profile.id,
    followedByMe: profile.followedByMe,
    followerCount: profile.followerCount,
  });

  return <FollowButton following={follow.following} error={follow.error} onToggle={follow.toggle} size="sm" />;
};

// Follow button for a user known only by id (the author of a post). The follow state comes
// from the profile route, and the button mounts once it is known. Nothing for my own posts.
export const FollowUser = ({ userId }: { userId: string }) => {
  const { user } = useSession();
  const profile = useGetProfile(userId);

  if (user?.id === userId || profile.status !== "success") {
    return null;
  }

  return <Button profile={profile.data} />;
};
