import { useId, useState } from "react";
import type { ComponentProps } from "react";
import { EyeIcon } from "./icons";

export type InputProps = ComponentProps<"input"> & {
    label: string;
    error?: string;
    hint?: string;
};

export function Input({ label, error, hint, id, type = "text", className, ...rest }: InputProps) {
    const generatedId = useId();
    const [revealed, setRevealed] = useState(false);

    const inputId = id ?? generatedId;
    const isPassword = type === "password";

    return (
        <div className={`flex w-full flex-col gap-2 ${className ?? ""}`}>
            <label
                className="text-[0.6875rem] font-semibold tracking-[0.1em] text-pc-label uppercase"
                htmlFor={inputId}
            >
                {label}
            </label>

            <div className="relative flex items-center">
                <input
                    {...rest}
                    id={inputId}
                    type={isPassword && revealed ? "text" : type}
                    className={`h-12 w-full rounded-[0.625rem] border-none bg-pc-sand px-4 font-body text-[0.9375rem] text-pc-ink transition-shadow outline-none placeholder:text-pc-faint disabled:cursor-not-allowed disabled:text-pc-faint ${
                        error
                            ? "shadow-[inset_0_0_0_1.5px_var(--color-pc-danger)]"
                            : "focus:shadow-[inset_0_0_0_1.5px_var(--color-pc-cta)]"
                    } ${isPassword ? "pr-12" : ""}`}
                />

                {isPassword && (
                    <button
                        type="button"
                        aria-label={revealed ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        aria-pressed={revealed}
                        className={`absolute right-1.5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-[0.5rem] transition-colors hover:bg-pc-hover2 hover:text-pc-ink ${revealed ? "text-pc-ink" : "text-pc-muted2"}`}
                        onClick={() => setRevealed(!revealed)}
                    >
                        <EyeIcon />
                    </button>
                )}
            </div>

            {hint && !error && <p className="text-[0.75rem] text-pc-muted">{hint}</p>}
            {error && <p className="text-[0.75rem] font-medium text-pc-danger">{error}</p>}
        </div>
    );
}
