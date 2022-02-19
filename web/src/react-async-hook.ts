import {useEffect, useState} from "react";

/**
 * An enum of possible loading states for the {@link useAsync} hook.
 */
const enum AsyncState {
	Initial = 'initial',
	Loading = 'loading',
	Refresh = 'refresh',
	Done = 'done',
}

/**
 * A DIY react hook that allows for loading data from async functions.
 *
 * The component will be rendered twice: once while data is still loading, and once while the data is loading (or failed).
 * Compare the return result to {@link useAsync.loading} to check if still loading
 *
 * @param fn The async function to call.
 * @param refresh If true, the async function will be called again if completed.
 */
export function useAsync<R, E = unknown>(fn: () => Promise<R>, refresh?: boolean): AsyncResult<R, E> {
	const [state, setState] = useState<UseAsyncState<R, E>>({
		state: AsyncState.Initial
	});

	useEffect(() => {
		function doLoad() {
			fn().then(
				value => {
					setState({
						state: AsyncState.Done,
						result: {value: value} as Result<R, E>,
					});
				},
				error => {
					setState({
						state: AsyncState.Done,
						result: {error: error} as Result<R, E>,
					});
				}
			)
		}

		if (state.state === AsyncState.Initial) {
			setState({state: AsyncState.Loading}); // Prevent multiple requests.
			doLoad();
		} else if (refresh === true && state.state === AsyncState.Done) {
			setState({state: AsyncState.Refresh, result: state.result});
			doLoad()
		}
	}, [state.state, state.result, refresh, fn])

	// If it's done loading, return the result.
	if (state.state === AsyncState.Done || state.state === AsyncState.Refresh) {
		return state.result;
	}

	// Otherwise, say it's still loading.
	return useAsync.loading;
}

export namespace useAsync {
	export const loading = Symbol("useAsync loading");
}

/**
 * The possible return values for a useAsync hook.
 * If the data is still loading, this will be {@link useAsync.loading}.
 */
export type AsyncResult<T, E> = typeof useAsync.loading | Result<T, E>

/**
 * All the possible states for the {@link useAsync} hook.
 */
type UseAsyncState<T, E> = {
	state: AsyncState.Initial | AsyncState.Loading,
	result?: void,
} | {
	state: AsyncState.Done | AsyncState.Refresh
	result: Result<T, E>
}
