import { Link } from "react-router-dom";

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
        <div className="flex min-h-screen items-center justify-center bg-[#f1f1f1] p-6 [color-scheme:light]">
            <div className="w-full max-w-[24rem] rounded-[0.75rem] border border-solid border-[#00000014] bg-white p-8 text-center shadow-[0_2px_4px_#0000000d,0_4px_8px_#0000001a]">
                <p className="text-[0.75rem] font-medium tracking-[0.2em] text-[#9e9e9e]">404</p>

                <h1 className="mt-2 text-[1.5rem] font-semibold tracking-tight text-[#111111]">{title}</h1>
                <p className="mt-1 text-[0.875rem] text-[#525252]">{message}</p>

                <Link
                    className="mt-6 inline-flex h-10 items-center justify-center rounded-[0.625rem] bg-[#262626] px-4 text-[0.875rem] font-medium text-white no-underline transition-colors hover:bg-[#3d3d3d] active:bg-[#525252]"
                    to={to}
                >
                    {actionLabel}
                </Link>
            </div>
        </div>
    );
}
