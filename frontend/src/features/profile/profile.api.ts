
import { publicUserSchema } from '@petcircle/contracts';
import type { PublicUser } from '@petcircle/contracts';

export type { PublicUser };

export function profilePath(id: string): string {
    return '/users/' + encodeURIComponent(id);
}

export function parseProfile(data: unknown): PublicUser | null {
    const parsed = publicUserSchema.safeParse(data);

    return parsed.success ? parsed.data : null;
}
