import React from 'react';
import './Landing.module.scss';
import Controller from "$app/controller/controller";

export interface LandingProps {
	controller: Controller
}

export default function Landing(props: LandingProps) {
	return (
		<div className="App">
			Landing Page
		</div>
	);
}
