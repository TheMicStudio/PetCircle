import { useState, useEffect } from "react";

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export type State<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "success"; data: T };


export function useMutation<T>(url: string, body: T): State<T> {
  const [state, setState] = useState<State<T>>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    setState({status: "loading"});
    apiPost<T>(url, body, controller.signal)
      .then((res) => {
        if (!res.ok) {
          setState({ status: "error", message: res.error }); // => state = { status: "error", message: res.error }
          return;
        }
        else {
          if (res.data.length === 0 ) {
            setState({ status: "empty"})
          }
          else {
            setState({ status: "success", data: res.data}); // => state = { status: "success", data: res.data}
          }
        }
      })

    return () => controller.abort();
  }, []);

  return state;
}

export function apiPost<T>(url: string, data: T , signal: AbortSignal): Promise<ApiResult<T>> {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),

    signal

  }).then((res) => {
    const ApiResult = res.json()
    if (!res.ok) {
      return { ok: false, error: ApiResult.error };
    }
    return { ok: true, data: res.json() };
  });
}

export function apiGet<T>(url: string, signal?: AbortSignal): Promise<T> {
  return fetch(url, { signal }).then((res) => res.json());
}
