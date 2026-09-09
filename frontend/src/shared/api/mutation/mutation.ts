export type MutationMethod = 'POST' | 'PUT' | 'DELETE';

export type FieldErrors = Record<string, string>;

export type ApiErrorResponse = {
    error?: string;
    fields?: FieldErrors;
};

export type ApiResult<T> =
    | {
        ok: true;
        data: T | undefined;
    }
    | {
        ok: false;
        status: number;
        error: string;
        fields: FieldErrors;
    };


export type MutationState<T> =
    | {
        status: 'idle';
    }
    | {
        status: 'loading';
    }
    | {
        status: 'empty';
    }
    | {
        status: 'success';
        data: T | undefined;
    }
    | {
        status: 'error';
        message: string;
        fields: FieldErrors;
    };

async function apiRequest<
    TResponse,
    TBody,
>(
    url: string,
    method: MutationMethod,
    body?: TBody,
): Promise<ApiResult<TResponse>> {
    const request: RequestInit = {
        method,
        credentials: 'include',
    };

    if (body !== undefined) {
        if (body instanceof FormData) {
            request.body = body;
        } else {
            request.headers = { 'Content-Type': 'application/json' };
            request.body = JSON.stringify(body);
        }
    }

    const response = await fetch(url, request);

    if (response.status === 204) {
        return {
            ok: true,
            data: undefined,
        };
    }

    if (!response.ok) {
        const errorBody: ApiErrorResponse =
            await response.json();

        return {
            ok: false,
            status: response.status,
            error:
                errorBody.error ??
                `La requête a échoué avec le statut ${response.status}`,
            fields: errorBody.fields ?? {},
        };
    }

    const data: TResponse = await response.json();

    return {
        ok: true,
        data,
    };
}

export function apiPost<
    TResponse,
    TBody,
>(
    url: string,
    body?: TBody,
): Promise<ApiResult<TResponse>> {
    return apiRequest<TResponse, TBody>(
        url,
        'POST',
        body,
    );
}

export function apiPut<
    TResponse,
    TBody,
>(
    url: string,
    body?: TBody,
): Promise<ApiResult<TResponse>> {
    return apiRequest<TResponse, TBody>(
        url,
        'PUT',
        body,
    );
}

export function apiDelete<
    TResponse = void,
    TBody = undefined,
>(
    url: string,
    body?: TBody,
): Promise<ApiResult<TResponse>> {
    return apiRequest<TResponse, TBody>(
        url,
        'DELETE',
        body,
    );
}
