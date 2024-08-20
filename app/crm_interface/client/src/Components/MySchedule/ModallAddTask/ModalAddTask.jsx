import React, { useEffect, useState } from "react";
import { GrClose } from "react-icons/gr";
// import { Input } from "./Input";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdDone } from "react-icons/md";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { GoLocation } from "react-icons/go";
import { RiMenu2Fill } from "react-icons/ri";
import { LuLink } from "react-icons/lu";
import { FormControl, Input } from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { Select } from "chakra-react-select";
import axios from "axios";
import { createMeetingURL, participantsURL } from "../../../apiRoutes";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const ModalAddTask = ({ isOpen, onClose }) => {
	const authHeader = useAuthHeader();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [date, setDate] = useState(new Date());
	const [place, setPlace] = useState("");

	const [participants, setParticipants] = useState([]);
	const [selectedParticipants, setSelectedParticipants] = useState([]);

	useEffect(() => {
		axios
			.get(participantsURL, {
				headers: {
					Authorization: authHeader,
				},
			})
			.then((response) => {
				setParticipants(response.data);
			});
	}, []);
	if (!isOpen) return null;

	const handleSubmit = async () => {
		console.log(name);
		const response = await axios.post(
			createMeetingURL,
			{
				name: name,
				description: description,
				date: date,
				place: place,
				participants: selectedParticipants.map(
					(participant) => participant.value,
				),
			},
			{
				headers: {
					Authorization: authHeader,
				},
			},
		);

		if (response.status === 200) {
			// setMeetings([]);
			// setName("");
			// setDescription("");
			// setDate(new Date());
			// setPlace("");
		}

		onClose();
	};

	return (
		<div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-start pt-[10%]">
			<div className="bg-white p-6 rounded-md shadow-md w-1/2">
				<div className="flex justify-end items-center">
					<button
						className="p-2 hover:bg-blue-link hover:text-gray-200 rounded-full transition duration-500"
						onClick={onClose}
					>
						<GrClose />
					</button>
				</div>

				{/*<form>*/}
				<FormControl>
					<Input
						className="placeholder-gray-900 text-2xl px-2 py-1 outline-none border-b-2 w-full border-gray-300"
						placeholder={"Adicionar título"}
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</FormControl>

				<div>
					<div className="mt-4 flex gap-2 items-center">
						<span className="text-blue-link text-xl">
							<FaRegCalendarAlt />
						</span>
						{/*<DateInput />*/}
						<FormControl mt={4}>
							<SingleDatepicker
								name="date-input"
								date={date}
								onDateChange={setDate}
							/>
						</FormControl>
					</div>

					<div className="mt-2 flex gap-2 items-center">
						<span className="text-blue-link text-2xl">
							<AiOutlineUsergroupAdd />
						</span>
						{/*<Input placeholder={"Adicionar convidados"} type={"text"} />*/}
						<FormControl mt={4}>
							{/*<FormLabel>Participantes</FormLabel>*/}
							<Select
								useBasicStyles
								placeholder="Adicionar convidados"
								isMulti
								value={selectedParticipants}
								onChange={setSelectedParticipants}
								closeMenuOnSelect={false}
								options={participants.map((participant) => ({
									value: participant.email,
									label: participant.name,
								}))}
								hideSelectedOptions={false}
							/>
						</FormControl>
					</div>

					<div className="mt-2 flex gap-2 items-center">
						<span className="text-blue-link text-xl">
							<GoLocation />
						</span>
						<Input
							placeholder={"Adicionar localização"}
							value={place}
							onChange={(e) => setPlace(e.target.value)}
						/>
					</div>

					<div className="mt-2 flex gap-2 items-center">
						<span className="text-blue-link text-xl">
							<RiMenu2Fill />
						</span>
						<Input
							placeholder={"Adicionar descrição"}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>

					<div className="mt-2 flex gap-2 items-center">
						<span className="text-blue-link text-xl">
							<LuLink />
						</span>
						<Input placeholder={"Adicionar link"} type={"text"} />
					</div>

					<div className="flex justify-end items-center gap-2 mt-3">
						<button
							onClick={handleSubmit}
							className="flex gap-1 items-center bg-blue-link hover:bg-blue-600 py-2 px-4 text-gray-100 rounded-md"
						>
							<MdDone />
							Confirmar
						</button>
					</div>
				</div>
				{/*</form>*/}
			</div>
		</div>
	);
};

export default ModalAddTask;
