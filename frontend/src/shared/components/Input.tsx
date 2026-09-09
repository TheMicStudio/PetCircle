import { useId, useState } from "react";
import type { ComponentProps } from "react";

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
        <div className={`flex w-full flex-col gap-1.5 ${className ?? ""}`}>
            <label className="text-[0.875rem] font-medium text-[#111111]" htmlFor={inputId}>
                {label}
            </label>

            <div className="relative flex items-center">
                <input
                    {...rest}
                    id={inputId}
                    type={isPassword && revealed ? "text" : type}
                    className={`h-10 w-full rounded-[0.625rem] border border-solid bg-white px-3 text-[0.875rem] text-[#111111] transition-[border-color,box-shadow] outline-none placeholder:text-[#9e9e9e] disabled:cursor-not-allowed disabled:bg-[#f1f1f1] disabled:text-[#9e9e9e] ${
                        error
                            ? "border-[#9e0015] focus:border-[#9e0015] focus:shadow-[0_0_0_3px_#9e001526]"
                            : "border-[#d4d4d4] hover:border-[#a3a3a3] focus:border-[#262626] focus:shadow-[0_0_0_3px_#26262614]"
                    } ${isPassword ? "pr-16" : ""}`}
                />

                {isPassword && (
                    <button
                        type="button"
                        className="absolute right-1 h-8 rounded-[0.375rem] px-2 text-[0.75rem] font-medium text-[#525252] transition-colors hover:bg-[#f1f1f1] hover:text-[#111111]"
                        onClick={() => setRevealed(!revealed)}
                    >
                        {revealed ? "Cacher" : "Voir"}
                    </button>
                )}
            </div>

            {hint && !error && <p className="text-[0.75rem] text-[#525252]">{hint}</p>}
            {error && <p className="text-[0.75rem] font-medium text-[#9e0015]">{error}</p>}
        </div>
    );
}
