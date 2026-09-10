import type { ComponentProps } from "react";

export type ButtonProps = ComponentProps<"button"> & {
    variant?: "primary" | "secondary";
    fullWidth?: boolean;
};

const VARIANTS = {
    primary:
        "bg-pc-cta text-pc-ink hover:bg-pc-cta2 active:bg-pc-accent disabled:bg-pc-sand disabled:text-pc-faint",
    secondary:
        "bg-pc-sand text-pc-ink hover:bg-pc-hover2 active:bg-pc-hair2 disabled:text-pc-faint",
};

export function Button({ variant = "primary", fullWidth = false, className, type = "button", ...rest }: ButtonProps) {
    return (
        <button
            {...rest}
            type={type}
            className={`inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[0.75rem] px-5 font-body text-[0.9375rem] font-bold transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pc-forest disabled:cursor-not-allowed ${VARIANTS[variant]} ${fullWidth ? "w-full" : ""} ${className ?? ""}`}
        />
    );
}
