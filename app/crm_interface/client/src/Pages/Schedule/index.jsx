import React, { useEffect, useState } from "react";
import { IoTodayOutline } from "react-icons/io5";
import Calendar_ from "../../Components/Dashboard/Calendar";
import DateDropdown from "../../Components/Dashboard/DropdownData";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import axios from "axios";
import { meetingsURL } from "../../apiRoutes";

export default function Schedule() {
	let [data, setData] = useState("");

	const [meetings, setMeetings] = useState([]);
	const [selectedDayMeetings, setSelectedDayMeetings] = useState([]);
	const authHeader = useAuthHeader();
	const [loadedMeetings, setLoadedMeetings] = useState(false);

	const childToParent = (childdata) => {
		// childata was a change event, get the new value
		setData(childdata.target.value);
		setLoadedMeetings(false);
	};

	useEffect(() => {
		if (loadedMeetings) return;
		setLoadedMeetings(true);
		setMeetings([]);
		setSelectedDayMeetings([]);
		axios
			.get(meetingsURL, {
				headers: {
					Authorization: authHeader,
				},
			})
			.then((response) => {
				const meetings = response.data;
				setMeetings(meetings);
				// const events = meetings.map((meeting) => ({
				// 	title: meeting.name,
				// 	start: meeting.date,
				// 	end: meeting.date,
				// }));
				if (data === "")
					data = `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
				const day = data.split("/")[0];
				const month = data.split("/")[1];
				const year = data.split("/")[2];
				const selectedDay = new Date(Number(year), month - 1, Number(day));
				const selectedDayMeetings = meetings.filter((meeting) => {
					const meetingDate = new Date(meeting.date);
					return (
						meetingDate.getDate() === selectedDay.getDate() &&
						meetingDate.getMonth() === selectedDay.getMonth() &&
						meetingDate.getFullYear() === selectedDay.getFullYear()
					);
				});
				setSelectedDayMeetings(selectedDayMeetings);
			});
	}, [meetings, authHeader, loadedMeetings, data]);

	return (
		<div className="bg-gray-50 pb-5">
			<div className="flex flex-col mb-4">
				<div className="grid gap-2 grid-cols-4 h-[400px] p-3 mt-20">
					<div className="col-span-3 shadow shadow-gray-300 rounded px-4 py-3 bg-white">
						<div className="flex justify-between text-gray-600 ">
							{/*		<div>*/}
							{/*			<h1 className="font-semibold text-gray-700 text-xl">*/}
							{/*				Calendar 1 tile*/}
							{/*			</h1>*/}
							{/*			<p className="text-sm text-gray-400">*/}
							{/*				Lorem ipsum dolor sit amet consectetur !*/}
							{/*			</p>*/}
							{/*		</div>*/}
							{/*		<button className="text-gray-900 font-semibold py-2">...</button>*/}
							{/*	</div>*/}
							{/*	<div className="flex justify-between max-w-[400px] mt-4 font-semibold">*/}
							{/*		<div className="flex gap-1 justify-center items-center">*/}
							{/*			<IoTodayOutline size={20} />*/}
							{/*			Today*/}
							{/*		</div>*/}
							{/*		<div>*/}
							{/*			<DateDropdown1 />*/}
							{/*		</div>*/}
						</div>
						{/*	<EventList />*/}
					</div>
					<div className="col-span-1 shadow px-3 shadow-gray-300 rounded bg-white">
						<div className="flex justify-between mt-4 w-full">
							<div>
								<h1 className="font-semibold">Next events</h1>
							</div>
							<button className="font-semibold text-gray-900 py-2">...</button>
						</div>
						<div className="flex justify-between  mt-4 font-semibold">
							<div className="flex gap-1 justify-center items-center">
								<IoTodayOutline size={14} />
								Today
							</div>

							<DateDropdown
								getSelectedDate={childToParent}
								selectedDate={new Date()}
							/>
							{selectedDayMeetings.map((meeting) => (
								<div key={meeting.id}>
									<h2>{meeting.name}</h2>
									<p>{meeting.date}</p>
								</div>
							))}
						</div>
						{/*<EventList1 d={data} />*/}
					</div>
					<div className="col-span-4 h-[400px]">
						<Calendar_ />
					</div>
				</div>
			</div>
		</div>
	);
}
