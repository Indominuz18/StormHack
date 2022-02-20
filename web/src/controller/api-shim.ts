import {Assignment, AssignmentID, AssignmentWithoutID} from "$modal/assignment";
import {Session} from "$modal/session";
import {API, DateRange, LoginSession, Password} from "$app/controller/api";
import {User} from "$modal/user";

/**
 * A shim API that uses the browser's localStorage to store all its data.
 * This is intended to be used during development.
 */
export class LocalstorageAPI implements API {

	protected localstorageInstance: Storage;
	protected localstorageKey: string;

	protected users: Map<string, LocalstorageUser>;
	protected assignmentsCounter: number;

	protected currentUser: LocalstorageUser | null;

	public constructor(localstorage: Storage, key: string) {
		this.localstorageInstance = localstorage;
		this.localstorageKey = key;
		this.assignmentsCounter = 0;
		this.currentUser = null;

		this.users = new Map();

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
			const {users, ...other} = JSON.parse(json);
			this.assignmentsCounter = other.assignmentsCounter;

			// Load the users.
			this.users = new Map();
			for (const userRaw of users) {
				const user = rehydrateUser(userRaw);
				this.users.set(user.id, user);
			}

			// Load the current user.
			if (other.currentUser != null) {
				this.currentUser = this.users.get(other.currentUser) ?? null;
			}

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
			currentUser: this.currentUser?.id,
			users: Array.from(this.users.values())
				.map(user => dehydrateUser(user)),
		}));
	}

	/**
	 * Wipes all the data from LocalStorage and reloads the page.
	 */
	_reset() {
		this.localstorageInstance.removeItem(this.localstorageKey);
		window.history.go(0);
	}

	async login(username: string, password: Password): Promise<LoginSession> {
		if (username === '') throw new Error("username must not be empty");
		if (password === '') throw new Error("password must not be empty");

		const user = this.users.get(username);
		if (user == null || user.password !== password) {
			throw new Error("invalid username or password");
		}

		// Login successful.
		this.currentUser = user;
		this._save();
		return `shim-${username}`;
	}

	async register(username: string, password: Password): Promise<LoginSession> {
		if (username === '') throw new Error("username must not be empty");
		if (password === '') throw new Error("password must not be empty");

		const user = this.users.get(username);
		if (user != null) throw new Error("user already exists");

		// Create the user.
		const newUser = {
			id: username,
			password: password,
			info: {name: username},

			assignments: new Map(),
			sessions: new Map(),
		};

		this.users.set(username, newUser)

		// Login successful.
		this.currentUser = newUser;
		this._save();
		return `shim-${username}`;
	}

	async logout(): Promise<void> {
		this.currentUser = null;
		this._save();
	}

	async createAssignment(assignment: AssignmentWithoutID): Promise<Readonly<Assignment>> {
		if (this.currentUser === null) throw new Error('not logged in');
		if (isNaN(new Date(assignment.dueDate).getTime())) throw new Error(`invalid due date: ${assignment.dueDate}`);

		const id = `${++this.assignmentsCounter}`;
		const created = this._frozen({...assignment, id});
		this.currentUser.assignments.set(id, created);
		this._save();
		return created;
	}

	async getAssignmentById(id: AssignmentID): Promise<Readonly<Assignment>> {
		if (this.currentUser === null) throw new Error('not logged in');

		const assignment = this.currentUser.assignments.get(id);
		if (assignment === undefined) {
			throw new Error(`no assignment with id ${id}`);
		}

		return assignment
	}

	async getAssignmentsForDateRange(range: DateRange): Promise<Readonly<Assignment[]>> {
		if (this.currentUser === null) throw new Error('not logged in');

		const fromMillis = range.from.getTime();
		const toMillis = range.to.getTime();

		// Iterate all assignments.
		const matching: Assignment[] = [];
		this.currentUser.assignments.forEach(assignment => {
			const assignmentDue = Date.parse(assignment.dueDate);
			if (assignmentDue >= fromMillis && assignmentDue <= toMillis) {
				matching.push(assignment);
			}
		})

		// Return the matching ones.
		return matching;
	}

	async getSessionsOfAssignment(id: AssignmentID): Promise<Readonly<Session[]>> {
		if (this.currentUser === null) throw new Error('not logged in');

		const sessions = this.currentUser.sessions.get(id);
		if (sessions === undefined) throw new Error(`no assignment with id ${id}`);

		return sessions;
	}

	async updateAssignment(id: AssignmentID, assignment: AssignmentWithoutID): Promise<Readonly<Assignment>> {
		if (this.currentUser === null) throw new Error('not logged in');
		if (!this.currentUser.assignments.has(id)) throw new Error(`no assignment with id ${id}`);
		if (isNaN(new Date(assignment.dueDate).getTime())) throw new Error(`invalid due date: ${assignment.dueDate}`);

		const old = this.currentUser.assignments.get(id)!;
		const updated = this._frozen({...old, ...assignment});
		this.currentUser.assignments.set(id, updated);
		this._save();

		return updated;
	}

	async updateSessions(id: AssignmentID, sessions: Session[]): Promise<Readonly<Session[]>> {
		if (this.currentUser === null) throw new Error('not logged in');
		if (!this.currentUser.assignments.has(id)) throw new Error(`no assignment with id ${id}`);

		let copiedSessions: Session[] = [];
		for (const session of sessions) {
			if (isNaN(Date.parse(session.startDate))) throw new Error(`session start date invalid: ${session.startDate}`);
			if (isNaN(Date.parse(session.endDate))) throw new Error(`session end date invalid: ${session.endDate}`);
			if (session.title === '') throw new Error(`session is missing title`);
			copiedSessions.push({
				...session,
				assignment: id,
			})
		}

		this.currentUser.sessions.set(id, copiedSessions);
		this._save();

		return this._frozen([...copiedSessions]);
	}

	async getLoginUserInfo(): Promise<User> {
		if (this.currentUser === null) throw new Error('not logged in');

		return {
			...this.currentUser.info,
			id: this.currentUser.id,
		};
	}

	async getSessionsForDateRange(range: DateRange): Promise<Readonly<Session[]>> {
		if (this.currentUser === null) throw  new Error('not logged in');

		const fromMillis = range.from.getTime();
		const toMillis = range.to.getTime();

		// Iterate all sessions.
		const matching: Session[] = [];
		this.currentUser.sessions.forEach(sessions => {
			sessions.forEach(session => {
				const sessionStart = Date.parse(session.startDate)
				const sessionEnd = Date.parse(session.endDate);

				if (sessionStart > fromMillis && sessionStart < toMillis || sessionEnd > fromMillis && sessionEnd < toMillis) {
					matching.push(session);
				}
			})
		});

		// Return the matching ones.
		return matching;
	}


}

interface LocalstorageUser {
	id: string;
	password: string; // NOT HASHED! DO NOT USE ME IN PRODUCTION!
	info: {
		name: string;
	}

	assignments: Map<AssignmentID, Assignment>;
	sessions: Map<AssignmentID, Session[]>;
}

/**
 * Dehydrates a {@link LocalstorageUser} into a JSON-compatible object.
 * @param user The user to dehydrate.
 */
function dehydrateUser(user: LocalstorageUser): any {
	return {
		id: user.id,
		password: user.password,
		info: user.info,

		assignments: Array.from(user.assignments.entries()),
		sessions: Array.from(user.sessions.entries()),
	}
}

/**
 * Hydrates a deserialized JSON-compatible object back into a {@link LocalstorageUser}.
 * @param parsed The parsed object.
 */
function rehydrateUser(parsed: any): LocalstorageUser {
	return {
		id: parsed.id,
		info: parsed.info,
		password: parsed.password,

		assignments: new Map(parsed.assignments),
		sessions: new Map(parsed.sessions),
	}
}
