import {Assignment, AssignmentID, AssignmentWithoutID} from "$modal/assignment";
import {Session} from "$modal/session";
import {User} from "$modal/user";

/**
 * API is an interface describing how to interact with the calendar application's API.
 */
export interface API {

	/**
	 * Attempts to log in to the server.
	 *
	 * @param username The username.
	 * @param password The user's password.
	 *
	 * @endpoint POST /api/v1/login
	 */
	login(username: string, password: Password): Promise<LoginSession>;

	/**
	 * Attempts to register a new user on the server.
	 * This will automatically log the user in.
	 *
	 * @param username The username.
	 * @param password The user's password.
	 *
	 * @endpoint POST /api/v1/register
	 */
	register(username: string, password: Password): Promise<LoginSession>;

	/**
	 * Attempts to log out from the server.
	 *
	 * @endpoint POST /api/v1/logout
	 */
	logout(): Promise<void>;

	/**
	 * Gets the currently-logged-in user's info.
	 *
	 * @endpoint GET /api/v1/me
	 */
	getLoginUserInfo(): Promise<User>;

	/**
	 * Gets an assignment by its ID.
	 *
	 * @param id The assignment ID.
	 *
	 * @endpoint GET /api/v1/assignments/:id
	 */
	getAssignmentById(id: AssignmentID): Promise<Readonly<Assignment>>

	/**
	 * Updates an existing assignment.
	 *
	 * @param id The assignment to update.
	 * @param assignment The data to update the assignment with.
	 * @returns The updated Assignment object.
	 *
	 * @endpoint PATCH /api/v1/assignments/:id
	 */
	updateAssignment(id: AssignmentID, assignment: AssignmentWithoutID): Promise<Readonly<Assignment>>

	/**
	 * Creates a new assignment.
	 *
	 * @param assignment The assignment to create.
	 * @returns The newly-created Assignment object.
	 *
	 * @endpoint POST /api/v1/assignments/new
	 */
	createAssignment(assignment: AssignmentWithoutID): Promise<Readonly<Assignment>>

	/**
	 * Gets a list of assignments that take place over the provided date range.
	 *
	 * @param range The date range.
	 *
	 * @endpoint GET /api/v1/assignments/for-range?from=${date}&to=${date}
	 */
	getAssignmentsForDateRange(range: DateRange): Promise<Readonly<Assignment[]>>

	/**
	 * Gets a list of sessions that take place over the provided date range.
	 *
	 * @param range The date range.
	 *
	 * @endpoint GET /api/v1/sessions/for-range?from=${date}&to=${date}
	 */
	getSessionsForDateRange(range: DateRange): Promise<Readonly<Session[]>>

	/**
	 * Gets the work sessions scheduled for the assignment.
	 *
	 * @param id The assignment ID.
	 *
	 * @endpoint GET /api/v1/assignments/:id/sessions
	 */
	getSessionsOfAssignment(id: AssignmentID): Promise<Readonly<Session[]>>

	/**
	 * Gets the work sessions scheduled for the assignment.
	 *
	 * @param id The assignment ID.
	 * @param sessions The sessions to update.
	 *
	 * @endpoint PATCH /api/v1/assignments/:id/sessions
	 */
	updateSessions(id: AssignmentID, sessions: Session[]): Promise<Readonly<Session[]>>

}

export type DateRange = {
	from: Date,
	to: Date,
}

export type LoginSession = string;
export type Password = string;
