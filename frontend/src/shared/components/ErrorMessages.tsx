import type { FieldErrors } from '../api/mutation/mutation';

export function ErrorMessages({ errors }: { errors?: FieldErrors }) {
    const entries = Object.entries(errors ?? {});

    if (entries.length === 0) {
        return null;
    }

    return (
        <ul className="mt-2 flex flex-col gap-1">
            {entries.map(([field, message]) => (
                <li className="text-[0.75rem] font-medium text-[#9e0015]" key={field}>
                    {message}
                </li>
            ))}
        </ul>
    );
}
