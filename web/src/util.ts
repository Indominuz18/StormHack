/**
 * Wraps a promise, making it return a {@link Result} instead of throwing on failure.
 * @param p The promise to wrap.
 */
export async function resultify<T>(p: Promise<T>): Promise<Result<T, unknown>> {
	try {
		return {value: (await p)} as any;
	} catch (e) {
		return {error: e} as any;
	}
}
