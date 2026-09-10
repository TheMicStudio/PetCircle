import { useRef, useState } from "react";
import { useSession } from "../../../features/auth/session";
import { apiDelete, apiPost, apiPut, type ApiResult, type MutationMethod, type MutationState } from "./mutation";

export function useApiMutation<
    TResponse,
    TBody,
>(
    method: MutationMethod,
    url: string,
) {
    const { setUser } = useSession();

    const [state, setState] =
        useState<MutationState<TResponse>>({
            status: 'idle',
        });

    const pending = useRef<Promise<ApiResult<TResponse>> | null>(null);

    async function run(
        body?: TBody,
    ): Promise<ApiResult<TResponse>> {
        setState({
            status: 'loading',
        });

        try {
            let result: ApiResult<TResponse>;

            if (method === 'POST') {
                result = await apiPost<TResponse, TBody>(
                    url,
                    body,
                );
            } else if (method === 'PUT') {
                result = await apiPut<TResponse, TBody>(
                    url,
                    body,
                );
            } else {
                result = await apiDelete<TResponse, TBody>(
                    url,
                    body,
                );
            }

            if (result.ok === false) {
                if (result.status === 401) {
                    setUser(null);
                }

                setState({
                    status: 'error',
                    message: result.error,
                    fields: result.fields,
                });

                return result;
            }

            if (Array.isArray(result.data) && result.data.length === 0) {
                setState({
                    status: 'empty',
                });

                return result;
            }

            setState({
                status: 'success',
                data: result.data,
            });

            return result;
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Une erreur réseau est survenue';

            setState({
                status: 'error',
                message,
                fields: {},
            });

            return {
                ok: false,
                status: 0,
                error: message,
                fields: {},
            };
        }
    }

    function mutate(
        body?: TBody,
    ): Promise<ApiResult<TResponse>> {
        if (pending.current !== null) {
            return pending.current;
        }

        pending.current = run(body).finally(() => {
            pending.current = null;
        });

        return pending.current;
    }

    function reset() {
        setState({
            status: 'idle',
        });
    }

    return {
        state,
        mutate,
        reset,
    };
}
