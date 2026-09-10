// No profile pictures exist in the API, the avatar is the first letter of the username.
const TINTS = [
  "bg-pc-sage text-pc-forest",
  "bg-pc-amber text-pc-amber-text",
  "bg-pc-sand2 text-pc-body",
];

const SIZES = {
  sm: "h-8 w-8 text-[0.8125rem]",
  md: "h-11 w-11 text-[1rem]",
  lg: "h-[7rem] w-[7rem] text-[2.75rem] md:h-[8.5rem] md:w-[8.5rem] md:text-[3.25rem]",
};

export type AvatarProps = {
  username: string;
  size?: keyof typeof SIZES;
  className?: string;
};

// the tint is stable for a given username, so the same user always gets the same color
const tintFor = (username: string): string => {
  const sum = [...username].reduce((total, char) => total + (char.codePointAt(0) ?? 0), 0);
  return TINTS[sum % TINTS.length];
};

export const Avatar = ({ username, size = "md", className }: AvatarProps) => (
  <span
    aria-hidden="true"
    className={`inline-flex shrink-0 select-none items-center justify-center rounded-full font-display font-semibold uppercase ${SIZES[size]} ${tintFor(username)} ${className ?? ""}`}
  >
    {username.slice(0, 1)}
  </span>
);
