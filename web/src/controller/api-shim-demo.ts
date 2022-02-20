import {LocalstorageAPI} from "$app/controller/api-shim";
import {Accent} from "$modal/accents";
import {Session} from "$modal/session";

const GENERATOR = {
	ACCENTS: [Accent.Mint, Accent.Lavender, Accent.Pyro, Accent.Sea, Accent.Love, Accent.Rose],

	COURSE_NAMES: [
		'HACK', 'CMPT', 'SFU', 'LING', 'ENG', 'PAIN',
		'PHIL', 'PSYC', 'STORM', 'COGS', 'MACM', 'MATH',
	],

	NOUNS: [
		"Computer", "Hackathon", "Website", "React", "NodeJS",
		"Godzilla", "Mecha Frogs", "Philosophy", "AI", "Bitcoin",
		"eSports", "Dogecoin", "Call of Duty", "MLM", "History",
		"Lasers", "Windows 11", "Linux", "Piranhas", "Livestock",
	],

	ASSIGNMENT_TEMPLATES: [
		(n: string) => `Learn ${n}`,
		(n: string) => `Take over the world using ${n}`,
		(n: string) => `${n} Practice`,
		(n: string) => `Walk the dog with ${n}`,
		(n: string) => `Buy ${n} textbook`,
		(n: string) => `${n} Stuff`,
		(n: string) => `${n} Presentation`,
		(n: string) => `Email ${n} Prof`,
	],

	SESSION_TEMPLATES: [
		(n: string) => `${n} Work`,
	]
};

function randomIn<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

/**
 * A shim API that generates assignments for demonstration purposes.
 */
export class DemoAPI extends LocalstorageAPI {

	public constructor() {
		super(null as any /* THIS IS FINE */, '');
	}

	_save() {
		// Disabled.
	}

	_load(): Result<void, Error> {
		// Disabled.
		return {};
	}

	async _demo(): Promise<void> {
		await this.register('demo', 'demo');

		// Create 7 assignments.
		let assignments = [];
		for (let i = 0; i < 7; i++) {
			const courseName = randomIn(GENERATOR.COURSE_NAMES);
			const courseCode = (Math.floor(Math.random() * 8 + 1) * 100) + Math.floor(Math.random() * 99);

			const dueDate = new Date(Date.now() + Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7)).toISOString();
			const assignment = randomIn(GENERATOR.ASSIGNMENT_TEMPLATES)(randomIn(GENERATOR.NOUNS));

			assignments.push(await this.createAssignment({
				course: `${courseName} ${courseCode}`,
				dueDate: dueDate,
				color: randomIn(GENERATOR.ACCENTS),
				name: assignment,
			}));
		}

		// Create between 1-2 sessions per assignment.
		for (const assignment of assignments) {
			let sessionCount = 1 + Math.floor(Math.random() * 2);
			let sessions: Session[] = [];

			const assignmentDue = new Date(assignment.dueDate);
			const range = assignmentDue.getTime() - Date.now();

			for (let i = 0; i < sessionCount; i++) {
				for (let attempt = 0; attempt < 5; attempt++) {
					const title = randomIn(GENERATOR.SESSION_TEMPLATES)(randomIn(GENERATOR.NOUNS));
					const startDate = new Date(Date.now() + Math.floor(Math.random() * range));
					const endDate = new Date(startDate.getTime() + ((1000 * 60 * 30) * Math.floor(1 + Math.random() * 5)));

					if ((await this.getSessionsForDateRange({from: startDate, to: endDate})).length > 1) {
						console.log("CONFLICT");
						continue;
					}

					sessions.push({
						assignment: assignment.id,
						endDate: endDate.toISOString(),
						startDate: startDate.toISOString(),
						title: title,
					});

					break;
				}
			}

			await this.updateSessions(assignment.id, sessions);
		}
	}

}
