import type { ComponentProps } from "react";

export type ButtonProps = ComponentProps<"button"> & {
    variant?: "primary" | "secondary";
    fullWidth?: boolean;
};

const VARIANTS = {
    primary:
        "bg-[#262626] text-white hover:bg-[#3d3d3d] active:bg-[#525252] disabled:bg-[#f1f1f1] disabled:text-[#9e9e9e]",
    secondary:
        "border border-solid border-[#d4d4d4] bg-white text-[#111111] hover:bg-[#f1f1f1] active:bg-[#e5e5e5] disabled:text-[#9e9e9e]",
};

export function Button({ variant = "primary", fullWidth = false, className, type = "button", ...rest }: ButtonProps) {
    return (
        <button
            {...rest}
            type={type}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-[0.625rem] px-4 text-[0.875rem] font-medium transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0074e2] disabled:cursor-not-allowed ${VARIANTS[variant]} ${fullWidth ? "w-full" : ""} ${className ?? ""}`}
        />
    );
}
