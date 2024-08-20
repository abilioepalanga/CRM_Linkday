import React from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { meetingsURL } from "../../apiRoutes";

export default function TestComponent() {
	const authHeader = useAuthHeader();
	const sendRequest = async () => {
		const response = await fetch(meetingsURL, {
			headers: {
				Authorization: authHeader,
			},
		});
		const data = await response.json();
		console.log(data);
	};

	return (
		<div>
			<h1>Test Component</h1>
			<p>This is a test component</p>
			<p>Auth Header: {authHeader}</p>
			{/*	button that sends a request to an apiRoute*/}
			<button onClick={sendRequest}>Send Request</button>
		</div>
	);
}
