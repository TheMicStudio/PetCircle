import { Link } from "react-router-dom";
import { PawIcon } from "./icons";

export const Brand = ({ size = "md" }: { size?: "md" | "lg" }) => (
  <Link className="flex items-center gap-2 no-underline" to="/feed">
    <PawIcon className="text-pc-cta" size={size === "lg" ? 22 : 20} />
    <span
      className={`font-display font-semibold tracking-[-0.01em] text-pc-ink ${size === "lg" ? "text-[1.375rem]" : "text-[1.3125rem]"}`}
    >
      Pet<span className="text-pc-accent">Circle</span>
    </span>
  </Link>
);
