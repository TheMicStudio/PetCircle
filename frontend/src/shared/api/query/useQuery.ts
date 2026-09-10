import { useEffect, useState } from 'react';
import { useSession } from '../../../features/auth/session';
import { apiGet, type QueryResult } from './query';

export type QueryState<T> =
    | {
        status: 'loading';
    }
    | {
        status: 'error';
        message: string;
        httpStatus?: number;
    }
    | {
        status: 'empty';
    }
    | {
        status: 'success';
        data: T;
    };

export function useApiQuery<TResponse>(url: string) {
    const { setUser } = useSession();

    const [state, setState] = useState<QueryState<TResponse>>({
        status: 'loading',
    });

    useEffect(() => {
        const controller = new AbortController();

        async function fetchData() {
            setState({
                status: 'loading',
            });

            try {
                const result: QueryResult<TResponse> = await apiGet<TResponse>(
                    url,
                    controller.signal,
                );

                // url changed or component gone: writing state here would
                // resurrect a stale answer over the current one
                if (controller.signal.aborted) {
                    return;
                }

                if (result.ok === false) {
                    // expired session: drop the user so the whole app reacts at once
                    if (result.status === 401) {
                        setUser(null);
                    }

                    setState({
                        status: 'error',
                        message: result.error,
                        httpStatus: result.status,
                    });

                    return;
                }

                if (Array.isArray(result.data) && result.data.length === 0) {
                    setState({
                        status: 'empty',
                    });

                    return;
                }

                setState({
                    status: 'success',
                    data: result.data,
                });
            } catch (error) {
                // abort() rejects the fetch, that is not a failure to show
                if (controller.signal.aborted) {
                    return;
                }

                const message =
                    error instanceof Error
                        ? error.message
                        : 'Une erreur réseau est survenue';

                setState({
                    status: 'error',
                    message,
                });
            }
        }

        void fetchData();

        // a new url or an unmount cancels the previous request, so a slow
        // answer can never overwrite a newer one
        return () => {
            controller.abort();
        };
    }, [url, setUser]);

    return state;
}
