import React, { useEffect, useState } from "react";
import DayColumn from "./DayColumn";
import { getWeekDays } from "../../../ultils/dateUtils";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import { meetingsURL } from "../../../apiRoutes";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const WeeklyAgenda = () => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
	const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
	const authHeader = useAuthHeader();
	const [meetings, setMeetings] = useState([]);
	const [events, setEvents] = useState({});
	// const [flag, setFlag] = useState(false);

	useEffect(() => {
		axios
			.get(meetingsURL, {
				headers: {
					Authorization: authHeader,
				},
			})
			.then((response) => {
				const meetings = response.data;
				console.log(meetings);
				setMeetings(meetings);
			});
	}, []);
	useEffect(() => {
		//	set the events here based on meetings
		const newEvents = {};
		meetings.forEach((meeting) => {
			const date = new Date(meeting.date);
			console.log(date);
			const day = date.getDate();
			// check if the month and year match the selected
			if (
				date.getMonth() !== selectedMonth ||
				date.getFullYear() !== selectedYear
			) {
				return;
			}
			if (!newEvents[day]) {
				newEvents[day] = [];
			}
			newEvents[day].push(meeting.name);
		});
		setEvents(newEvents);
	}, [meetings, selectedYear, selectedMonth, currentDate]);

	const handlePreviousWeek = () => {
		const previousWeek = new Date(currentDate);
		previousWeek.setDate(currentDate.getDate() - 7);
		setCurrentDate(previousWeek);
	};

	const handleNextWeek = () => {
		const nextWeek = new Date(currentDate);
		nextWeek.setDate(currentDate.getDate() + 7);
		setCurrentDate(nextWeek);
	};

	const handleYearChange = (event) => {
		const year = parseInt(event.target.value);
		setSelectedYear(year);
		const newDate = new Date(year, selectedMonth, 1);
		setCurrentDate(newDate);
	};

	const handleMonthChange = (event) => {
		const month = parseInt(event.target.value);
		setSelectedMonth(month);
		const newDate = new Date(selectedYear, month, 1);
		setCurrentDate(newDate);
	};

	const weekDays = getWeekDays(currentDate);
	//
	// const events = {
	// 	13: ["Evento 1", "Evento 2"],
	// 	14: ["Evento 3", "Evento 4"],
	// 	15: ["Evento 5"],
	// 	16: ["Evento 6", "Evento 7", "Evento 8"],
	// 	17: ["Evento 9"],
	// 	18: [],
	// 	19: [],
	// };

	return (
		<div className="p-4 bg-white min-h-screen rounded-md">
			<div className="flex justify-end mb-4 gap-4">
				<div className="flex items-center gap-4">
					<select
						value={selectedYear}
						onChange={handleYearChange}
						className="p-2 rounded border"
					>
						{[...Array(11)].map((_, index) => {
							const year = new Date().getFullYear() - 5 + index;
							return (
								<option key={year} value={year}>
									{year}
								</option>
							);
						})}
					</select>
					<select
						value={selectedMonth}
						onChange={handleMonthChange}
						className="p-2 rounded border"
					>
						{Array.from({ length: 12 }, (_, index) => (
							<option key={index} value={index}>
								{new Date(0, index).toLocaleString("default", {
									month: "long",
								})}
							</option>
						))}
					</select>
				</div>
				<button
					onClick={handlePreviousWeek}
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
				>
					<IoIosArrowBack />
				</button>
				<button
					onClick={handleNextWeek}
					className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
				>
					<IoIosArrowForward />
				</button>
			</div>
			<div className="flex border-t border-l mx-4">
				{weekDays.map((date, index) => (
					<DayColumn
						key={index}
						day={`${date.toLocaleDateString("pt-PT", { weekday: "long" })} ${date.getDate()}`}
						events={events[date.getDate()] || []}
					/>
				))}
			</div>
		</div>
	);
};

export default WeeklyAgenda;
