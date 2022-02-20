import React from 'react';
import Controller from "$app/controller/controller";
import Calendar from "$app/pages/Calendar";

namespace Main {
	export interface Props {
		controller: Controller
	}
}

function Main(props: Main.Props) {
	return (
		<Calendar {...props}/>
	);
}

export default Main;
