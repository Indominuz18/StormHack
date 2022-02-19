/**
 * Result is an object that either contains a `value` field, or an `error` field, but not both.
 * Reading from this type requires the object to be inspected.
 */
declare type Result<T, E = any> = T extends void ? ResultVoid<E> : ResultReal<T, E>

type ResultVoid<E> = {
	error?: void
} | {
	value?: void
	error: E
}

type ResultReal<T, E> = {
	value: T
	error?: void
} | {
	value?: void
	error: E
}
