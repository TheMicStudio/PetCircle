import type { ReactNode } from "react";

type IconProps = { size?: number; className?: string };

// Icons ported from the design handoff, drawn with currentColor so the parent sets the tint.
const Svg = ({
  size,
  className,
  box = "0 0 24 24",
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 1.65,
  children,
}: IconProps & {
  box?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  children: ReactNode;
}) => (
  <svg
    aria-hidden="true"
    className={className}
    fill={fill}
    height={size}
    stroke={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
    style={{ display: "block", flex: "0 0 auto" }}
    viewBox={box}
    width={size}
  >
    {children}
  </svg>
);

export const PawIcon = ({ size = 14, className }: IconProps) => (
  <Svg box="0 0 34 32" className={className} fill="currentColor" size={size} stroke="none">
    <ellipse cx="7.5" cy="11" rx="3.1" ry="4.3" transform="rotate(-16 7.5 11)" />
    <ellipse cx="14.6" cy="7.6" rx="3.3" ry="4.7" transform="rotate(-4 14.6 7.6)" />
    <ellipse cx="22" cy="8.6" rx="3.2" ry="4.5" transform="rotate(9 22 8.6)" />
    <ellipse cx="28.4" cy="14.4" rx="2.9" ry="3.9" transform="rotate(24 28.4 14.4)" />
    <path d="M17.4 13.6c4.7 0 8.6 3.8 8.6 8 0 3.4-2.7 5.3-5.8 5.3-1.5 0-2.1-.5-2.9-.5s-1.4.5-2.9.5c-3.1 0-5.8-1.9-5.8-5.3 0-4.2 3.9-8 8.8-8z" />
  </Svg>
);

export const DogHeadIcon = ({ size = 14, className }: IconProps) => (
  <Svg className={className} fill="currentColor" size={size} stroke="none">
    <ellipse cx="4.9" cy="11.4" rx="2.3" ry="4.4" transform="rotate(-10 4.9 11.4)" />
    <ellipse cx="19.1" cy="11.4" rx="2.3" ry="4.4" transform="rotate(10 19.1 11.4)" />
    <path d="M8.4 5.4h7.2c2.3 0 3.7 1.7 3.7 4.1v3.2c0 3.8-2.6 6.7-7.3 6.7s-7.3-2.9-7.3-6.7V9.5c0-2.4 1.4-4.1 3.7-4.1z" />
  </Svg>
);

export const BarkIcon = ({ size = 18, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={1.6}>
    <path d="M4.6 10.4C4.6 7 8 4.4 12.2 4.4S19.8 7 19.8 10.4s-3.4 6-7.6 6c-.7 0-1.4-.1-2-.2l-4.1 2.4 1-3.2c-1.6-1.1-2.5-2.6-2.5-4.4z" />
  </Svg>
);

export const DenIcon = ({ size = 19, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={1.6}>
    <path d="M3.6 11.2L12 4.4l8.4 6.8" />
    <path d="M5.6 10.6V19.6h12.8v-9" />
    <path d="M9.2 19.6v-3.4a2.8 2.8 0 015.6 0v3.4" />
  </Svg>
);

export const CameraIcon = ({ size = 18, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={1.6}>
    <path d="M4.2 8.4h3.2l1.4-2.2h6.4l1.4 2.2h3.2v10.2H4.2z" />
    <circle cx="12" cy="13.2" r="3.1" />
  </Svg>
);

export const RailIcon = ({ size = 19, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={1.7}>
    <path d="M4.4 6h6M4.4 12h6M4.4 18h6" />
    <path d="M14.6 5.2v13.6" />
  </Svg>
);

export const RailRightIcon = ({ size = 19, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={1.7}>
    <path d="M13.6 6h6M13.6 12h6M13.6 18h6" />
    <path d="M9.4 5.2v13.6" />
  </Svg>
);

export const BackIcon = ({ size = 16, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={1.9}>
    <path d="M14.5 6l-6 6 6 6" />
  </Svg>
);

export const ArrowIcon = ({ size = 13, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={1.9}>
    <path d="M5 12h13M13 6l6 6-6 6" />
  </Svg>
);

export const ChevronIcon = ({ size = 15, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={1.8}>
    <path d="M7 10l5 5 5-5" />
  </Svg>
);

export const CollarIcon = ({ size = 17, className }: IconProps) => (
  <Svg className={className} size={size}>
    <path d="M12 4.2c4.3 0 7.6 2.9 7.6 6.4 0 1.9-1 3.5-2.6 4.6M12 4.2c-4.3 0-7.6 2.9-7.6 6.4 0 1.9 1 3.5 2.6 4.6" />
    <path d="M12 14.4v2.1" />
    <circle cx="12" cy="19" r="2.5" />
  </Svg>
);

export const EyeIcon = ({ size = 18, className }: IconProps) => (
  <Svg className={className} size={size}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 9.4a2.6 2.6 0 100 5.2 2.6 2.6 0 000-5.2z" />
  </Svg>
);

export const TrashIcon = ({ size = 17, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={1.6}>
    <path d="M5 7h14M9.5 7V4.8h5V7M7 7l.8 12.2h8.4L17 7M10.2 10.4l.3 6M13.8 10.4l-.3 6" />
  </Svg>
);

export const CatHeadIcon = ({ size = 13, className }: IconProps) => (
  <Svg className={className} fill="currentColor" size={size} stroke="none">
    <path d="M4.6 9.7L6.1 4.1l4.1 3.3h3.6l4.1-3.3 1.5 5.6c.2.8.3 1.6.3 2.4 0 4.6-3.4 7.9-7.7 7.9S4.3 16.7 4.3 12.1c0-.8.1-1.6.3-2.4z" />
  </Svg>
);

export const RabbitHeadIcon = ({ size = 15, className }: IconProps) => (
  <Svg className={className} fill="currentColor" size={size} stroke="none">
    <ellipse cx="9.2" cy="7.2" rx="2" ry="4.9" transform="rotate(-12 9.2 7.2)" />
    <ellipse cx="14.8" cy="7.2" rx="2" ry="4.9" transform="rotate(12 14.8 7.2)" />
    <ellipse cx="12" cy="15.4" rx="5.4" ry="4.5" />
  </Svg>
);

export const BirdIcon = ({ size = 14, className }: IconProps) => (
  <Svg className={className} fill="currentColor" size={size} stroke="none">
    <path d="M9.6 4.6c3.2 0 5.6 2.2 6.2 5l2.9 1.7-2.7.5c-.3 4.3-3.2 7.6-7 7.6-1.4 0-2.4-.4-2.4-.4l1.5-2.4c-1.9-1.2-3-3.4-3-6 0-3.4 2-6 4.5-6z" />
    <path d="M6.4 8.2L3.2 9.4l3.1 1.4z" />
  </Svg>
);

export const BoneIcon = ({ size = 18, className }: IconProps) => (
  <Svg className={className} fill="currentColor" size={size} stroke="none">
    <rect height="3.2" rx="1.6" width="10.8" x="6.6" y="10.4" />
    <circle cx="6.1" cy="9.6" r="2.6" />
    <circle cx="6.1" cy="14.4" r="2.6" />
    <circle cx="17.9" cy="9.6" r="2.6" />
    <circle cx="17.9" cy="14.4" r="2.6" />
  </Svg>
);

const trailPad = (cx: number, cy: number, r: number, rot: number) => (
  <g key={`${cx}-${cy}`} transform={`rotate(${rot} ${cx} ${cy})`}>
    <ellipse cx={cx} cy={cy} rx={r} ry={r * 1.2} />
    <circle cx={cx - r * 0.95} cy={cy - r * 1.35} r={r * 0.36} />
    <circle cx={cx - r * 0.3} cy={cy - r * 1.75} r={r * 0.36} />
    <circle cx={cx + r * 0.45} cy={cy - r * 1.7} r={r * 0.36} />
  </g>
);

export const TrailIcon = ({ size = 18, className }: IconProps) => (
  <Svg className={className} fill="currentColor" size={size} stroke="none">
    {trailPad(6.4, 17.4, 2.5, -18)}
    {trailPad(12, 12.4, 2.5, 4)}
    {trailPad(17.6, 7.4, 2.5, 20)}
  </Svg>
);

export const BellIcon = ({ size = 19, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={1.6}>
    <path d="M10.4 4.6a1.9 1.9 0 013.2 0" />
    <circle cx="12" cy="13.2" r="7" />
    <path d="M5.4 11.6h13.2M9.6 19.4c1.6.6 3.2.6 4.8 0" />
  </Svg>
);

export const BallIcon = ({ size = 18, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={1.6}>
    <circle cx="12" cy="12" r="7.6" />
    <path d="M6.6 6.6c2.4 1.4 3.6 3.2 3.6 5.4s-1.2 4-3.6 5.4" />
    <path d="M17.4 6.6c-2.4 1.4-3.6 3.2-3.6 5.4s1.2 4 3.6 5.4" />
  </Svg>
);

export const HealthIcon = ({ size = 18, className }: IconProps) => (
  <Svg className={className} size={size}>
    <path d="M6 4.6h12v15H6zM9.6 9.4h4.8M12 7v4.8M9.6 15.4h4.8" />
  </Svg>
);

export const SniffIcon = ({ size = 18, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={1.6}>
    <circle cx="10.6" cy="10.6" r="6.4" />
    <path d="M15.3 15.3L20 20" />
    <g fill="currentColor" stroke="none">
      <circle cx="8.4" cy="8.6" r=".9" />
      <circle cx="10.8" cy="7.9" r=".9" />
      <circle cx="13" cy="9" r=".9" />
      <ellipse cx="10.7" cy="12.2" rx="2.3" ry="1.9" />
    </g>
  </Svg>
);

export const DotsIcon = ({ size = 19, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={2}>
    <path d="M6 12h.01M12 12h.01M18 12h.01" />
  </Svg>
);

export const PlusIcon = ({ size = 15, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={1.8}>
    <path d="M12 6v12M6 12h12" />
  </Svg>
);

export const PinIcon = ({ size = 15, className }: IconProps) => (
  <Svg className={className} size={size}>
    <path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 10-13 0C5.5 15 12 21 12 21zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
  </Svg>
);

export const SunIcon = ({ size = 34, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={1.6}>
    <circle cx="12" cy="12" r="4.6" />
    <path d="M12 3.2v2.2M12 18.6v2.2M3.2 12h2.2M18.6 12h2.2M5.9 5.9l1.6 1.6M16.5 16.5l1.6 1.6M18.1 5.9l-1.6 1.6M7.5 16.5l-1.6 1.6" />
  </Svg>
);

export const SunCloudIcon = ({ size = 19, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={1.6}>
    <circle cx="9.6" cy="9.4" r="3.2" />
    <path d="M9.2 15.6h8a3.2 3.2 0 100-6.4 4.4 4.4 0 00-8.2-.6" />
  </Svg>
);

export const CloudIcon = ({ size = 19, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={1.6}>
    <path d="M6.6 15.4h9.8a3.4 3.4 0 100-6.8 4.8 4.8 0 00-9.4.9 3 3 0 00-.4 5.9z" />
  </Svg>
);

export const RainIcon = ({ size = 19, className }: IconProps) => (
  <Svg className={className} size={size} strokeWidth={1.6}>
    <path d="M6.8 13.4h9.4a3.2 3.2 0 100-6.4 4.6 4.6 0 00-9-.5" />
    <path d="M9 17.2l-.8 1.8M13 17.2l-.8 1.8" />
  </Svg>
);

export const AppleIcon = ({ size = 17, className }: IconProps) => (
  <Svg className={className} size={size}>
    <path d="M16.3 12.6c0-2.4 2-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.9-1.5-.1-2.4.8-3 .8-.6 0-1.6-.8-2.7-.8-1.4 0-2.7.8-3.4 2.1-1.5 2.5-.4 6.2 1.1 8.2.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7 1.2 0 1.5.7 2.6.7 1.1 0 1.8-1 2.5-2 .5-.8.8-1.5 1-2-.1 0-2.6-1-2.6-3.9zM14 5.6c.6-.7.9-1.7.8-2.6-.9 0-2 .6-2.6 1.3-.5.6-1 1.6-.8 2.5 1 .1 2-.5 2.6-1.2z" />
  </Svg>
);

export const GoogleIcon = ({ size = 17, className }: IconProps) => (
  <Svg className={className} size={size}>
    <path d="M21 12.2c0-.7-.1-1.2-.2-1.8H12v3.4h5c-.1.9-.7 2.2-1.9 3l2.9 2.2c1.7-1.6 2.6-3.9 2.6-6.8zM12 21c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.9-3.1.9-2.4 0-4.5-1.6-5.2-3.8l-3 2.3C5.2 18.9 8.3 21 12 21zM6.8 13.7A5.6 5.6 0 016.5 12c0-.6.1-1.2.3-1.7L3.7 8C3.2 9.2 3 10.5 3 12s.3 2.8.8 4zM12 6.4c1.7 0 2.9.7 3.5 1.3l2.6-2.5C16.5 3.8 14.4 3 12 3 8.3 3 5.2 5.1 3.7 8l3.1 2.3c.7-2.2 2.8-3.9 5.2-3.9z" />
  </Svg>
);

export const LogoutIcon = ({ size = 18, className }: IconProps) => (
  <Svg className={className} size={size}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </Svg>
);
