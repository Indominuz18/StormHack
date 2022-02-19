/**
 * Modal of an Assignment.
 */
export interface Assignment {
	id: AssignmentID
	course: string
	name: string
	dueDate: string
}

export type AssignmentWithoutID = Omit<Assignment, 'id'>
export type AssignmentID = string;
