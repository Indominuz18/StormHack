import {AssignmentID} from "$modal/assignment";

/**
 * Modal of a work session.
 */
export interface Session {
	assignment: AssignmentID
	startDate: string
	endDate: string
	title: string
}
