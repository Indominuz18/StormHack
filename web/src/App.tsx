import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {useAsync} from "$app/react-async-hook";

import Controller from "$app/controller/controller";

import Login from "$app/pages/Login";
import Main from "$app/pages/Main";
import Calendar from "$app/pages/Calendar";

export interface AppProps {
	controller: Controller
}

export default function App(props: AppProps) {
	const {controller} = props;
	let result = useAsync<boolean, any>(() => controller.isLoggedIn());
	if (result === useAsync.loading) {
		return (
			<div>Loading...</div> // TODO(eth-p): Maybe a better loading screen?
		)
	}

	// If the user isn't logged in, show the login page.
	if (result.value === false) {
		return (
			<Login controller={controller}/>
		)
	}

	// If the user is logged in, show the app.
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Main {...props}/>}/>
			</Routes>
		</BrowserRouter>
	);
}
