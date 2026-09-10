import { Link } from "react-router-dom";
import type { FeedPost, PostAuthor } from "@petcircle/contracts";
import { Inert } from "../../shared/components/Inert";
import { BallIcon, CloudIcon, PawIcon, RainIcon, SunCloudIcon, SunIcon } from "../../shared/components/icons";
import { MEETUPS, WEATHER } from "../../shared/showcase";
import { useSession } from "../auth/session";
import { FollowSuggestion } from "../follow/followSuggestion";
import { useFollowSuggestions } from "../follow/useFollowSuggestions";

const MAX_CANDIDATES = 6;
const MAX_SUGGESTIONS = 4;
const MAX_TOP_POSTS = 3;

const WEATHER_ICONS = { sun: SunIcon, suncloud: SunCloudIcon, cloud: CloudIcon, rain: RainIcon };

const SectionTitle = ({ children, aside, tone = "light" }: { children: string; aside?: string; tone?: "light" | "dark" }) => (
  <div className="mb-4 flex items-baseline justify-between gap-2.5">
    <h3 className={`text-[0.9375rem] font-bold ${tone === "dark" ? "" : "text-pc-ink"}`}>{children}</h3>
    {aside !== undefined && (
      <Inert className={`text-[0.75rem] font-medium ${tone === "dark" ? "text-[#f8c070]" : "text-pc-accent"}`}>{aside}</Inert>
    )}
  </div>
);

// authors seen in the loaded feed, without me, first appearance wins
const authorsOf = (posts: FeedPost[], myId: string | undefined): PostAuthor[] => {
  const seen = new Set<string>();
  const authors: PostAuthor[] = [];

  for (const post of posts) {
    if (post.author.id === myId || seen.has(post.author.id)) continue;
    seen.add(post.author.id);
    authors.push(post.author);
  }

  return authors.slice(0, MAX_CANDIDATES);
};

const topOf = (posts: FeedPost[]): FeedPost[] =>
  [...posts]
    .filter((post) => post.likeCount > 0)
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, MAX_TOP_POSTS);

// Right rail of the feed. Suggestions and top posts are derived from the posts already loaded,
// there is no discovery route in the API. Weather and meetups are the handoff design only.
export const DiscoveryRail = ({ posts }: { posts: FeedPost[] }) => {
  const { user } = useSession();
  const suggestions = useFollowSuggestions(authorsOf(posts, user?.id), MAX_SUGGESTIONS);
  const top = topOf(posts);

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-[0.875rem] bg-pc-amber p-[1.125rem]">
        <div className="flex items-center gap-3.5">
          <SunIcon className="text-pc-accent" />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[1.875rem] leading-none font-semibold tracking-[-0.02em] text-pc-ink">{WEATHER.now}</span>
              <span className="text-[0.78125rem] font-medium text-pc-amber-text">{WEATHER.summary}</span>
            </div>
            <div className="mt-2 text-[0.75rem] leading-[1.4] font-semibold text-pc-forest">{WEATHER.advice}</div>
          </div>
        </div>
        <div className="my-4 h-px bg-[#efd9b6]" />
        <div className="flex justify-between gap-1.5">
          {WEATHER.forecast.map((slot) => {
            const Icon = WEATHER_ICONS[slot.icon];
            return (
              <div className="flex flex-col items-center gap-2" key={slot.hour}>
                <span className="text-[0.6875rem] font-medium text-pc-amber-text">{slot.hour}</span>
                <Icon className={slot.tint} size={19} />
                <span className="text-[0.78125rem] font-semibold text-pc-ink">{slot.temp}</span>
              </div>
            );
          })}
        </div>
      </section>

      {suggestions.length > 0 && (
        <section className="rounded-[0.875rem] bg-pc-surface p-[1.125rem]">
          <SectionTitle aside="Tout voir">Animaux à suivre</SectionTitle>
          <ul className="flex flex-col gap-[0.9375rem]">
            {suggestions.map((profile) => (
              <FollowSuggestion key={profile.id} profile={profile} />
            ))}
          </ul>
        </section>
      )}

      {top.length > 0 && (
        <section className="rounded-[0.875rem] bg-pc-forest p-[1.125rem] text-[#f4eadc]">
          <SectionTitle aside="Tout" tone="dark">Top posts du fil</SectionTitle>
          <ul className="flex flex-col">
            {top.map((post) => (
              <li key={post.id}>
                <Link className="flex items-center gap-3 py-3 no-underline" to={`/posts/${post.id}`}>
                  {post.imageUrl !== null ? (
                    <img
                      alt=""
                      className="h-[2.875rem] w-[2.875rem] shrink-0 rounded-[0.5rem] bg-pc-photo object-cover"
                      src={post.imageUrl}
                    />
                  ) : (
                    <span className="flex h-[2.875rem] w-[2.875rem] shrink-0 items-center justify-center rounded-[0.5rem] bg-pc-forest2 text-[#f8c070]">
                      <PawIcon size={18} />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-[0.84375rem] leading-[1.4] font-medium text-[#f4eadc]">
                      {post.content}
                    </span>
                    <span className="mt-1 block text-[0.71875rem] text-[#c9dcbf]">
                      {post.author.username} · {post.likeCount} patte{post.likeCount > 1 ? "s" : ""}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-[0.875rem] bg-pc-surface p-[1.125rem]">
        <div className="mb-3.5 flex items-baseline justify-between gap-2.5">
          <h3 className="text-[0.9375rem] font-bold text-pc-ink">Rencontres près de vous</h3>
          <span className="text-[0.75rem] font-medium text-pc-muted">Brooklyn</span>
        </div>
        <ul className="flex flex-col gap-3">
          {MEETUPS.map((meetup) => (
            <li key={meetup.place}>
              <Inert className="flex w-full items-center gap-3 rounded-[0.625rem] bg-pc-surface2 px-3 py-[0.6875rem] text-left transition-colors hover:bg-pc-hair">
                <span className="min-w-[2.125rem] text-center">
                  <span className="block font-display text-[1.0625rem] leading-none font-semibold text-pc-ink">{meetup.day}</span>
                  <span className="mt-[5px] block text-[0.625rem] font-semibold tracking-[0.1em] text-pc-body2 uppercase">{meetup.month}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.8125rem] leading-[1.3] font-semibold text-pc-ink">{meetup.place}</span>
                  <span className="mt-[5px] block text-[0.71875rem] leading-[1.2] text-pc-body2">{meetup.going}</span>
                </span>
                <BallIcon className="text-pc-accent" />
              </Inert>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
