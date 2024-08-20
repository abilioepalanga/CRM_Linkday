// Separate Past from Upcoming meetings

// to obtain the meetings use axios to make a request to the meetingsURL
import "./MeetingsPage.css";
import * as React from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import {
	meetingsURL,
	createMeetingURL,
	participantsURL,
	editMeetingURL,
} from "../../apiRoutes";
import { useState, useEffect } from "react";
import axios from "axios";
import {
	Box,
	Button,
	Text,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	FormControl,
	FormLabel,
	Input,
	Collapse,
	useDisclosure,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";

import { SingleDatepicker } from "chakra-dayzed-datepicker";

export function MeetingsPage() {
	const authHeader = useAuthHeader();
	// const [meetings, setMeetings] = useState([]);
	const [upcomingMeetings, setUpcomingMeetings] = useState([]);
	const [pastMeetings, setPastMeetings] = useState([]);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isOpenPart, setIsOpenPart] = useState({});

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [date, setDate] = useState(new Date());
	const [place, setPlace] = useState("");

	const [participants, setParticipants] = useState([]);
	const [selectedParticipants, setSelectedParticipants] = useState([]);
	const [lastClickedStatus, setLastClickedStatus] = useState("Passadas");

	const handleAddMeeting = () => {
		onOpen();
		axios
			.get(participantsURL, {
				headers: {
					Authorization: authHeader,
				},
			})
			.then((response) => {
				setParticipants(response.data);
			});
	};

	const handleSubmit = async () => {
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
			setName("");
			setDescription("");
			setDate(new Date());
			setPlace("");
		}

		onClose();
	};

	useEffect(() => {
		// if (meetings.length !== 0) return;
		axios
			.get(meetingsURL, {
				headers: {
					Authorization: authHeader,
				},
			})
			.then((response) => {
				const meetings = response.data;
				// setMeetings(meetings);

				const today = new Date();
				const upcomingMeetings = [];
				const pastMeetings = [];
				meetings.forEach((meeting) => {
					const meetingDate = new Date(meeting.date);
					if (meetingDate > today) {
						upcomingMeetings.push(meeting);
					} else {
						pastMeetings.push(meeting);
					}
				});
				setUpcomingMeetings(upcomingMeetings);
				setPastMeetings(pastMeetings);
			});
	}, []);

	function MeetingsDiv({ meetings }) {
		return (
			<div className="row">
				{meetings.map((meeting) => {
					const [isEditingDescription, setIsEditingDescription] =
						useState(false);
					const [editedDescription, setEditedDescription] = useState(
						meeting.description,
					);
					const handleDescriptionDoubleClick = () => {
						setIsEditingDescription(true);
					};

					const handleDescriptionKeyDown = (event, meeting, onBlur) => {
						if (event.key === "Enter" || onBlur) {
							// Here you can handle the update of the description
							setIsEditingDescription(false);
							setDescription(editedDescription);
							meeting.description = editedDescription;
							axios
								.post(editMeetingURL, meeting, {
									headers: {
										Authorization: authHeader,
									},
								})
								.then((r) => {
									console.log(r);
								});
						}
					};

					return (
						/*<div className="col-3" key={meeting.id}>
							<div className="rounded-5 p-4 card-shadow">
								<div className="card-body">
									<h6 className="card-subtitle mb-2 text-muted text-start">
										Meeting - {String(meeting.id).padStart(7, "0")}
									</h6>
									<h5 className="card-title text-start">{meeting.name}</h5>
								</div>
								<div className="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center mt-3">
									<div className="d-flex align-items-center">
										<span className="badge rounded-pill bg-light text-dark me-4">
											---
										</span>
									</div>
								</div>
							</div>
						</div>*/
						<div className="col-3 p-3 mt-3" key={meeting.id}>
							<Box
								key={meeting.id}
								borderRadius="lg"
								mb="6"
								style={{ boxShadow: "0px 4px 10px 0px #0008311A" }}
							>
								<Box p="4" mb="4" borderRadius="md">
									<Text
										style={{
											fontSize: "23px",
											fontWeight: 500,
											lineHeight: "20px",
										}}
									>
										{meeting.name}
									</Text>
									{isEditingDescription ? (
										<Input
											autoFocus
											value={editedDescription}
											onChange={(e) => setEditedDescription(e.target.value)}
											onBlur={(event) =>
												handleDescriptionKeyDown(event, meeting, true)
											}
											onKeyDown={(event) =>
												handleDescriptionKeyDown(event, meeting, false)
											}
										/>
									) : (
										<Text
											as="p"
											fontSize="23px"
											fontWeight={500}
											mt="2"
											onDoubleClick={() =>
												handleDescriptionDoubleClick(meeting.description)
											}
										>
											{meeting.description}
										</Text>
									)}
									<Text color="gray.500" fontSize="sm" mt="2">
										{meeting.date}
									</Text>
									<Text mt={4} fontWeight="bold">
										{/*	button to toggle participants*/}
										<Button
											onClick={() =>
												setIsOpenPart({
													...isOpenPart,
													[meeting.id]: !isOpenPart[meeting.id],
												})
											}
										>
											{isOpenPart[meeting.id]
												? "Hide Participants"
												: "Show Participants"}
										</Button>
									</Text>
									<Collapse
										in={isOpenPart[meeting.id]}
										onClick={() =>
											setIsOpenPart({
												...isOpenPart,
												[meeting.id]: !isOpenPart[meeting.id],
											})
										}
									>
										<ul style={{ paddingLeft: 20 }}>
											{meeting.participants.map((participant) => (
												<li key={participant.email}>
													{participant.name} ({participant.email})
												</li>
											))}
										</ul>
									</Collapse>
								</Box>
							</Box>
						</div>
					);
				})}
			</div>
		);
	}

	return (
		<div className="container text-center m-0">
			<div className="row align-items-start">
				<div className="col">
					<div className="row align-items-start bg-light-blue p-3 ">
						<div className="col">
							<h1 className="text-start font-color-blue fw-bold fs-1">
								Gerenciador de Reuniões
							</h1>
						</div>
					</div>
					<div className="row align-items-start p-3 ">
						<div className="col-2 pe-0 me-0">
							<h4 className="text-start font-color-blue fw-bold fs-2">
								Reuniões
							</h4>
						</div>
						<div className="col-1 text-start ps-0 me-5">
							<Button
								style={{ backgroundColor: "#1D37C4", color: "white" }}
								onClick={handleAddMeeting}
							>
								+ Nova Reunião
							</Button>
						</div>
					</div>
					<div className="row">
						<div className="col-6">
							<button
								type="button"
								className={`btn bg-light-blue fw-bold font-color-blue btn-pill w-100 p-3 ${lastClickedStatus === "Passadas" ? "active-button" : ""}`}
								onClick={() =>
									setLastClickedStatus(
										lastClickedStatus === "Passadas" ? "" : "Passadas",
									)
								}
							>
								Passadas
							</button>
						</div>
						<div className="col-6">
							<button
								type="button"
								className={`btn bg-light-blue fw-bold font-color-blue btn-pill w-100 p-3 ${lastClickedStatus === "Futuras" ? "active-button" : ""}`}
								onClick={() =>
									setLastClickedStatus(
										lastClickedStatus === "Futuras" ? "" : "Futuras",
									)
								}
							>
								Futuras
							</button>
						</div>
					</div>
				</div>
			</div>

			{lastClickedStatus === "Futuras" && (
				<MeetingsDiv meetings={upcomingMeetings} />
			)}
			{lastClickedStatus === "Passadas" && (
				<MeetingsDiv meetings={pastMeetings} />
			)}

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Adicionar Nova Reunião</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl>
							<FormLabel>Nome</FormLabel>
							<Input value={name} onChange={(e) => setName(e.target.value)} />
						</FormControl>

						<FormControl mt={4}>
							<FormLabel>Descrição</FormLabel>
							<Input
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</FormControl>

						<FormControl mt={4}>
							<FormLabel>Data</FormLabel>
							<SingleDatepicker
								name="date-input"
								date={date}
								onDateChange={setDate}
							/>
						</FormControl>

						<FormControl mt={4}>
							<FormLabel>Local</FormLabel>
							<Input value={place} onChange={(e) => setPlace(e.target.value)} />
						</FormControl>

						<FormControl mt={4}>
							<FormLabel>Participantes</FormLabel>
							<Select
								useBasicStyles
								placeholder="Select participants"
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
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" mr={3} onClick={handleSubmit}>
							Guardar
						</Button>
						<Button variant="ghost" onClick={onClose}>
							Cancelar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
