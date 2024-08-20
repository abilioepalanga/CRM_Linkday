import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";
import { meetingsURL } from "../../../apiRoutes";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

export default function Calendar_() {
	const [meetings, setMeetings] = useState([]);
	const [events, setEvents] = useState([]);
	const authHeader = useAuthHeader();
	const [loadedMeetings, setLoadedMeetings] = useState(false);
	// let loadedMeetings = false;
	useEffect(() => {
		if (loadedMeetings) return;
		// loadedMeetings = true;
		setLoadedMeetings(true);
		setMeetings([]);
		setEvents([]);
		axios
			.get(meetingsURL, {
				headers: {
					Authorization: authHeader,
				},
			})
			.then((response) => {
				const meetings = response.data;
				setMeetings(meetings);
				console.log(meetings);
				const events = meetings.map((meeting) => ({
					title: meeting.name,
					start: meeting.date,
					end: meeting.date,
				}));
				setEvents(events); // Update events state only once
			});
	}, [meetings, authHeader, loadedMeetings]);
	useEffect(() => console.log(events), [events]);

	const customDayCellContent = (arg) => {
		//const dayBackgroundColor = 'bg-blue-400'; // Defina a cor de fundo desejada aqui

		return (
			<div className="fc-daygrid-day-number rounded-full text-gray-40 bg-gray-100">
				{arg.dayNumberText}
			</div>
		);
	};

	return (
		<div className="w-full mt-4 mb-8">
			<FullCalendar
				plugins={[dayGridPlugin]}
				headerToolbar={{
					left: "prev,next today",
					center: "title",
					right: false,
				}}
				initialView="dayGridMonth" // Exibe o calendário no modo de visualização de mês
				events={events}
				dayHeaderClassNames={["bg-gray-200", "text-gray-600", "font-medium"]}
				dayCellContent={customDayCellContent}
			/>
		</div>
	);
}
