import React, {PropsWithChildren} from 'react';

import Controller from "$app/controller/controller";
import {useAsync} from "$app/react-async-hook";
import ErrorCard from "$app/components/misc/ErrorCard";
import {Assignment} from "$modal/assignment";
import AssignmentCard from "$app/components/calendar/AssignmentCard";

import Styles from "./AssignmentList.module.scss";

namespace AssignmentList {
	export interface Props {
		className?: string;
		controller: Controller;
		start: Date;
		end: Date;
	}
}

function AssignmentList(props: AssignmentList.Props) {
	const {controller} = props;
	const result = useAsync<readonly Assignment[]>(() => {
		return controller.api.getAssignmentsForDateRange({from: props.start, to: props.end});
	});

	let assignmentsContents = null;
	if (result === useAsync.loading) {
		assignmentsContents = <div>Loading...</div>;
	} else if (result.error) {
		assignmentsContents = <ErrorCard error={result.error}/>;
	} else if (result.value != null) {
		console.log(result.value);
		assignmentsContents = result.value
			.map(a => <AssignmentCard timeFormatter={controller.timeformatter} key={a.id} assignment={a}/>);
	}

	return (
		<div className={[Styles.assignmentList, props.className].filter(n => n != null).join(' ')}>
			{assignmentsContents}
		</div>
	);
}

export default AssignmentList;
