import {Assignment, AssignmentID, AssignmentWithoutID} from "$modal/assignment";
import {Session} from "$modal/session";
import {API, DateRange, LoginSession, Password} from "$app/controller/api";

/**
 * A shim API that uses the browser's localStorage to store all its data.
 * This is intended to be used during development.
 */
export class LocalstorageAPI implements API {

	protected localstorageInstance: Storage;
	protected localstorageKey: string;

	protected assignments: Map<AssignmentID, Assignment>;
	protected assignmentsCounter: number;
	protected sessions: Map<AssignmentID, Session[]>;

	public constructor(localstorage: Storage, key: string) {
		this.localstorageInstance = localstorage;
		this.localstorageKey = key;
		this.assignmentsCounter = 0;

		this.assignments = new Map<AssignmentID, Assignment>();
		this.sessions = new Map<AssignmentID, Session[]>();

		this._load();
	}

	protected _log(message: string, ...args: any) {
		console.log(`[api-shim] ${message}`, ...args);
	}

	protected _frozen<T>(obj: T): Readonly<T> {
		Object.freeze(obj);
		return obj;
	}

	/**
	 * Loads all the data from LocalStorage.
	 */
	_load(): Result<void, Error> {
		const json = this.localstorageInstance.getItem(this.localstorageKey);
		if (json == null) {
			this._log("Failed to load from LocalStorage: no data with key %s", this.localstorageKey);
			return {error: new Error(`no data with key ${this.localstorageKey}`)};
		}

		try {
			const {assignments, sessions, ...other} = JSON.parse(json);
			this.assignmentsCounter = other.assignmentsCounter;
			this.assignments = new Map(assignments);
			this.sessions = new Map(sessions);
			return {};
		} catch (ex: any) {
			this._log("Failed to load from LocalStorage: invalid data", ex);
			return {error: ex};
		}
	}

	/**
	 * Saves all the data from LocalStorage.
	 */
	_save() {
		this.localstorageInstance.setItem(this.localstorageKey, JSON.stringify({
			assignmentsCounter: this.assignmentsCounter,
			assignments: this.assignments.entries(),
			sessions: this.sessions.entries(),
		}));
	}

	login(username: string, password: Password): Result<LoginSession> {
		return {value: `shim-${username}`};
	}

	createAssignment(assignment: AssignmentWithoutID): Result<Readonly<Assignment>> {
		const id = `${++this.assignmentsCounter}`;
		const created = this._frozen({...assignment, id});
		this.assignments.set(id, created);

		// Return a copy.
		return {value: created};
	}

	getAssignmentById(id: AssignmentID): Result<Readonly<Assignment>> {
		const assignment = this.assignments.get(id);
		if (assignment === undefined) {
			return {error: new Error(`no assignment with id ${id}`)}
		}

		return {value: assignment};
	}

	getAssignmentsForDateRange(range: DateRange): Result<Readonly<Assignment[]>> {
		const fromMillis = range.from.getTime();
		const toMillis = range.to.getTime();

		// Iterate all assignments.
		const matching: Assignment[] = [];
		this.assignments.forEach(assignment => {
			const assignmentDue = Date.parse(assignment.dueDate);
			if (assignmentDue >= fromMillis && assignmentDue <= toMillis) {
				matching.push(assignment);
			}
		})

		// Return the matching ones.
		return {value: matching};
	}

	getSessionsOfAssignment(id: AssignmentID): Result<Readonly<Session[]>> {
		const sessions = this.sessions.get(id);
		if (sessions === undefined) {
			return {error: new Error(`no assignment with id ${id}`)};
		}

		return {value: sessions};
	}

	updateAssignment(id: AssignmentID, assignment: AssignmentWithoutID): Result<Readonly<Assignment>> {
		if (!this.assignments.has(id)) {
			return {error: new Error(`no assignment with id ${id}`)};
		}

		const old = this.assignments.get(id)!;
		const updated = this._frozen({...old, ...assignment});
		this.assignments.set(id, updated)
		return {value: updated};
	}

	updateSessions(id: AssignmentID, sessions: Session[]): Result<Readonly<Session[]>> {
		if (!this.sessions.has(id)) {
			return {error: new Error(`no assignment with id ${id}`)};
		}

		this.sessions.set(id, [...sessions])
		return {value: this._frozen([...sessions])};
	}

}
