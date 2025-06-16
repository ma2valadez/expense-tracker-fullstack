import { useState, useCallback, useEffect } from 'react';

interface AsyncState<T> {
    data: T | null;
    error: Error | null;
    loading: boolean;
}

export function useAsync<T>() {
    const [state, setState] = useState<AsyncState<T>>({
        data: null,
        error: null,
        loading: false,
    });

    const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
        setState({ data: null, error: null, loading: true });

        try {
            const data = await asyncFunction();
            setState({ data, error: null, loading: false });
            return data;
        } catch (error) {
            setState({ data: null, error: error as Error, loading: false });
            throw error;
        }
    }, []);

    return { ...state, execute };
}

export function useAsyncEffect<T>(
    asyncFunction: () => Promise<T>,
    deps: React.DependencyList = []
) {
    const { execute, ...state } = useAsync<T>();

    useEffect(() => {
        execute(asyncFunction);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return state;
}