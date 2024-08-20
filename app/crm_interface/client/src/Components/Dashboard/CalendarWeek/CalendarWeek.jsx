import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import {
	range,
	addDateBy,
	areDatesSame,
	getMonday,
} from "../../../ultils/utils";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import axios from "axios";
import { meetingsURL } from "../../../apiRoutes";

const Days = [
	"Segunda",
	"Terça",
	"Quarta",
	"Quinta",
	"Sexta",
	"Sábado",
	"Domingo",
];

console.log(addDateBy(new Date(), 1));
const CalendarWeek = () => {
	const [mondayDate, setMondayDate] = useState(getMonday());
	const [weekHeaderText, setWeekHeaderText] = useState("Esta Semana");

	const authHeader = useAuthHeader();
	const [events, setEvents] = useState([]);
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
				const newEvents = [];
				meetings.forEach((meeting) => {
					newEvents.push({ title: meeting.name, date: meeting.date });
				});
				console.log(newEvents);
				setEvents(newEvents);
			});
	}, []);

	useEffect(() => {
		const today = new Date();
		const nextMonday = addDateBy(mondayDate, 7);
		if (today >= mondayDate && today < nextMonday) {
			setWeekHeaderText("Esta Semana");
		} else if (today < mondayDate) {
			setWeekHeaderText("Próxima Semana");
		} else {
			setWeekHeaderText("Semana Anterior");
		}
	}, [mondayDate]);

	const nextWeek = () => {
		setMondayDate(addDateBy(mondayDate, 7));
	};

	const prevWeek = () => {
		setMondayDate(addDateBy(mondayDate, -7));
	};

	return (
		<div className="bg-white shadow-md p-4 w-full h-[450px] overflow-hidden ">
			<div className="flex justify-between items-center w-full mb-3">
				<div className="flex gap-2 items-center text-blue-600 text-xl">
					<FaRegCalendarAlt size={16} />
					<h1>Minha Agenda</h1>
				</div>
				<div className="flex gap-3 items-center text-blue-600">
					<h1>{weekHeaderText}</h1>
					<div className="flex gap-1">
						<button onClick={prevWeek} className="p-2">
							<IoIosArrowBack />
						</button>
						<button onClick={nextWeek} className="p-2">
							<IoIosArrowForward />
						</button>
					</div>
				</div>
			</div>
			<div className="flex w-full ">
				<div className="">
					{range(24).map((hour) => (
						<p key={hour} className="h-12">
							{}
						</p>
					))}
				</div>
				<div className="grid grid-cols-7 divide-x gap-4 w-full relative">
					{Days.map((day, index) => {
						const currentDate = addDateBy(mondayDate, index);
						const eventsOfDay = events.filter((event) => {
							const eventDate = new Date(event.date);
							return (
								eventDate.getDate() === currentDate.getDate() &&
								eventDate.getMonth() === currentDate.getMonth() &&
								eventDate.getFullYear() === currentDate.getFullYear()
							);
						});
						const isToday = areDatesSame(new Date(), currentDate);
						return (
							<div
								key={index}
								className={`text-center relative ${isToday ? "bg-blue-200" : ""}`}
							>
								<p>{day}</p>
								{eventsOfDay.map((event, idx) => (
									<div
										key={idx}
										className="text-sm bg-gray-200 rounded px-2 py-1 absolute"
										style={{
											top: `${new Date(event.date).getHours() * 20}px`, // Calcula o top com base na hora e minutos do evento
										}}
									>
										{event.title}
									</div>
								))}
							</div>
						);
					})}
					<div className="absolute border border-gray-300 top-8 w-full"></div>
				</div>
			</div>
		</div>
	);
};

export { CalendarWeek };
