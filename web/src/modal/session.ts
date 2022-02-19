import {AssignmentID} from "$modal/assignment";

/**
 * Modal of a work session.
 */
export interface Session {
	assignment: AssignmentID
	startDate: Date
	endDate: Date
}
