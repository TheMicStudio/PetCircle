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
