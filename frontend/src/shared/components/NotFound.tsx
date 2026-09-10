import { Link } from "react-router-dom";
import { Brand } from "./Brand";

export type NotFoundProps = {
    title?: string;
    message?: string;
    to?: string;
    actionLabel?: string;
};

export function NotFound({
    title = "Page introuvable",
    message = "Cette page n'existe pas ou a été déplacée.",
    to = "/feed",
    actionLabel = "Retour au fil",
}: NotFoundProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-pc-page p-6 font-body text-pc-ink [color-scheme:light]">
            <div className="flex w-full max-w-[26rem] flex-col items-center rounded-[1.25rem] bg-pc-surface p-10 text-center">
                <Brand />
                <p className="mt-8 text-[0.6875rem] font-semibold tracking-[0.2em] text-pc-label">404</p>

                <h1 className="mt-2 font-display text-[2rem] leading-[1.05] font-semibold tracking-[-0.025em]">{title}</h1>
                <p className="mt-3 max-w-[32ch] text-[0.9375rem] leading-[1.6] text-pc-muted">{message}</p>

                <Link
                    className="mt-7 inline-flex h-11 items-center justify-center rounded-[0.75rem] bg-pc-cta px-5 text-[0.9375rem] font-bold text-pc-ink no-underline transition-colors hover:bg-pc-cta2"
                    to={to}
                >
                    {actionLabel}
                </Link>
            </div>
        </div>
    );
}
