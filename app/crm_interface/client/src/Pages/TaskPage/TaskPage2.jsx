import "./TaskPage.css";
import { participantsURL, tasksURL } from "../../apiRoutes";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Icon } from "@chakra-ui/icon";
import { TiDeleteOutline } from "react-icons/ti";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import randomGuy from "../../assets/random_guy.jfif";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	useDisclosure,
	FormControl,
	FormLabel,
	Input,
	Select as ChakraSelect,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";

export default function TaskPage2() {
	const authHeader = useAuthHeader();

	const [tasks, setTasks] = useState([]);
	const [lastClickedStatus, setLastClickedStatus] = useState(null);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState();

	const openForm = () => {
		onOpen();
		axios
			.get(participantsURL, {
				headers: {
					Authorization: authHeader,
				},
			})
			.then((response) => {
				setUsers(response.data);
				console.log(response.data);
			})
			.catch((error) => {
				console.error("There was an error!", error);
			});
	};

	const toggleForm = () => {
		setIsFormOpen(!isFormOpen);
	};
	const handleNewTask = (event) => {
		event.preventDefault();
		const newTask = {
			title: event.target.elements.title.value,
			estimated_time: event.target.elements.estimated_time.value,
			spent_time: event.target.elements.spent_time.value,
			priority: event.target.elements.priority.value,
			status: event.target.elements.status.value,
			assigned_to: selectedUser.value ? selectedUser.value : null,
		};
		console.log(newTask);
		axios
			.post(`${tasksURL}/create`, newTask)
			.then((response) => {
				setTasks([...tasks, response.data]);
				toggleForm();
			})
			.catch((error) => {
				console.error("Failed to create task", error);
			});
	};

	const deleteTask = (taskId) => {
		axios
			.delete(`${tasksURL}/delete/${taskId}`)
			.then(() => {
				setTasks(tasks.filter((task) => task.id !== taskId));
			})
			.catch((error) => {
				console.error(`Failed to delete task with id ${taskId}`, error);
			});
	};

	/*const updateTask = (taskId, updatedTask) => {
		axios
			.put(`${tasksURL}/update/${taskId}`, updatedTask)
			.then((response) => {
				setTasks(
					tasks.map((task) => (task.id === taskId ? response.data : task)),
				);
			})
			.catch((error) => {
				console.error(`Failed to update task with id ${taskId}`, error);
			});
	};*/

	const fetchTasks = (status) => {
		let url = tasksURL;
		if (status && status !== lastClickedStatus) {
			url = `${tasksURL}/${status}`;
			setLastClickedStatus(status);
		} else {
			setLastClickedStatus(null);
		}

		axios
			.get(url)
			.then((response) => {
				setTasks(response.data);
			})
			.catch((error) => {
				console.error(`Tasks retrieval fail for status ${status}`, error);
			});
	};

	useEffect(() => {
		fetchTasks();
	}, []);

	return (
		<div className="container text-center m-0">
			<div className="row align-items-start">
				<div className="col">
					<div className="row align-items-start bg-light-blue p-3">
						<div className="col">
							<h1 className="text-start font-color-blue fw-bold fs-1">
								Gerenciador de Tarefas
							</h1>
						</div>
					</div>
					<div className="row align-items-start p-3 ">
						<div className="col-2 pe-0 me-0">
							<h4 className="text-start font-color-blue fw-bold fs-2">
								Tarefas
							</h4>
						</div>
						<div className="col-1 text-start ps-0 me-5">
							<Button
								style={{ backgroundColor: "#1D37C4", color: "white" }}
								onClick={openForm}
							>
								+ New Task
							</Button>
						</div>
						{/*
						<div className="col-4">
							<button
								type="button"
								className="bg-transparent border border-primary rounded-4 me-3 d-inline-block"
								style={{ width: "50px", height: "50px" }}
							>
								<Icon
									as={FaBars}
									style={{ color: "#001CAF", fontSize: "24px" }}
								/>
							</button>
							<button
								type="button"
								className="bg-transparent  border-0 rounded-4 d-inline-block"
								style={{ width: "50px", height: "50px" }}
								onClick={() => (window.location.href = "/tasks")}
							>
								<Icon
									as={LuBarChartBig}
									style={{ color: "#001CAF", fontSize: "24px" }}
								/>
							</button>
						</div>
						*/}
					</div>
					<div className="row">
						<div className="col-3">
							<button
								type="button"
								className={`btn bg-light-blue fw-bold font-color-blue btn-pill w-100 p-3 ${lastClickedStatus === "To Do" ? "active-button" : ""}`}
								onClick={() => fetchTasks("To Do")}
							>
								A fazer
							</button>
						</div>
						<div className="col-3">
							<button
								type="button"
								className={`btn bg-light-blue fw-bold font-color-blue btn-pill w-100 p-3 ${lastClickedStatus === "In Progress" ? "active-button" : ""}`}
								onClick={() => fetchTasks("In Progress")}
							>
								Em progresso
							</button>
						</div>
						<div className="col-3">
							<button
								type="button"
								className={`btn bg-light-blue fw-bold font-color-blue btn-pill w-100 p-3 ${lastClickedStatus === "In Review" ? "active-button" : ""}`}
								onClick={() => fetchTasks("In Review")}
							>
								Revisão
							</button>
						</div>
						<div className="col-3">
							<button
								type="button"
								className={`btn bg-light-blue fw-bold font-color-blue btn-pill w-100 p-3 ${lastClickedStatus === "Done" ? "active-button" : ""}`}
								onClick={() => fetchTasks("Done")}
							>
								Feitas
							</button>
						</div>
					</div>
					<div className="bg-light-blue fw-bold font-color-blue btn-pill w-100 p-3 mt-4 text-center">
						Ativas
					</div>
					{tasks.map((task) => (
						<div
							key={task.id}
							className="row align-items-start m-4 rounded-5 p-4 card-shadow"
						>
							<div className="col-3">
								<h6 className="card-subtitle mb-2 text-muted text-start">
									Task Name
								</h6>
								<h5 className="card-title text-start">{task.title}</h5>
							</div>
							<div className="col-1-5">
								<h6 className="card-subtitle mb-2 text-muted text-start">
									Estimate
								</h6>
								<h5 className="card-title text-start">{task.estimated_time}</h5>
							</div>
							<div className="col-1-5">
								<h6 className="card-subtitle mb-2 text-muted text-start">
									Spent Time
								</h6>
								<h5 className="card-title text-start">{task.spent_time}</h5>
							</div>
							<div className="col-1-5 text-start">
								<h6 className="card-subtitle mb-2 text-muted text-start">
									Assignee
								</h6>
								<img
									src={randomGuy}
									className="rounded-circle"
									alt="User"
									style={{ width: "30px", height: "30px" }}
								/>
							</div>
							<div className="col-1-5">
								<h6 className="card-subtitle mb-2 text-muted text-start">
									Priority
								</h6>
								{task.priority === "Medium" ? (
									<div
										style={{
											color: "#FFBD21",
											display: "flex",
											alignItems: "center",
										}}
									>
										<FaArrowUpLong style={{ fontSize: "20px" }} />
										<h6 className="card-title text-start ml-2">Medium</h6>
									</div>
								) : task.priority === "High" ? (
									<div
										style={{
											color: "#FF2121",
											display: "flex",
											alignItems: "center",
										}}
									>
										<FaArrowUpLong style={{ fontSize: "20px" }} />
										<h6 className="card-title text-start ml-2">High</h6>
									</div>
								) : (
									<div
										style={{
											color: "#0AC947",
											display: "flex",
											alignItems: "center",
										}}
									>
										<FaArrowDownLong style={{ fontSize: "20px" }} />
										<h6 className="card-title text-start ml-2">Low</h6>
									</div>
								)}
							</div>
							<div className="col-1-5 d-flex justify-content-center align-items-center">
								{task.status === "Done" ? (
									<div className="bg-done rounded-4 text-done text-center p-2 ps-4 pe-4">
										Done
									</div>
								) : task.status === "In Progress" ? (
									<div className="bg-in-progress rounded-4 text-in-progress text-center p-2 ps-4 pe-4">
										In Progress
									</div>
								) : task.status === "In Review" ? (
									<div className="bg-in-review rounded-4 text-in-review text-center p-2 ps-4 pe-4">
										In Review
									</div>
								) : (
									<div className="bg-to-do rounded-4 text-to-do text-center p-2 ps-4 pe-4">
										To Do
									</div>
								)}
							</div>
							<div className="col-1-5 d-flex justify-content-center align-items-center">
								<button
									type="button"
									className="bg-transparent border-0"
									onClick={() => deleteTask(task.id)}
								>
									<Icon
										as={TiDeleteOutline}
										style={{ color: "#7D8592", fontSize: "40px" }}
									/>
								</button>
								{/*

										<button
											type="button"
											className="bg-transparent border-0"
											onClick={() => updateTask(task.id, task)}
										>
											<Icon
												as={TiEdit}
												style={{ color: "#7D8592", fontSize: "40px" }}
											/>
										</button>
										*/}
							</div>
						</div>
					))}

					<Modal isOpen={isOpen} onClose={onClose}>
						<ModalOverlay />
						<ModalContent>
							<ModalHeader>Task</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<form id="formId" onSubmit={handleNewTask}>
									<FormControl id="title">
										<FormLabel>Task Title:</FormLabel>
										<Input type="text" name="title" required />
									</FormControl>

									<FormControl id="estimated_time" mt={4}>
										<FormLabel>Estimated Time:</FormLabel>
										<Input type="number" name="estimated_time" required />
									</FormControl>

									<FormControl id="spent_time" mt={4}>
										<FormLabel>Spent Time:</FormLabel>
										<Input type="number" name="spent_time" required />
									</FormControl>

									<FormControl id="priority" mt={4}>
										<FormLabel>Priority:</FormLabel>
										<ChakraSelect placeholder="Select option" required>
											<option value="Low">Low</option>
											<option value="Medium">Medium</option>
											<option value="High">High</option>
										</ChakraSelect>
									</FormControl>

									<FormControl id="status" mt={4}>
										<FormLabel>Status:</FormLabel>
										<ChakraSelect placeholder="Select option" required>
											<option value="To Do">To Do</option>
											<option value="In Progress">In Progress</option>
											<option value="In Review">In Review</option>
											<option value="Done">Done</option>
										</ChakraSelect>
									</FormControl>

									<FormControl mt={4}>
										<FormLabel>Assigned</FormLabel>

										<Select
											useBasicStyles
											placeholder="Select Assigned"
											value={selectedUser}
											onChange={(value) => {
												console.log(value);
												setSelectedUser(value);
											}}
											closeMenuOnSelect={false}
											options={users.map((user) => {
												return {
													value: user.email,
													label: user.name,
												};
											})}
											hideSelectedOptions={false}
										/>
									</FormControl>
								</form>
							</ModalBody>

							<ModalFooter>
								<Button variant="ghost" mr={3} onClick={onClose}>
									Close
								</Button>
								<Button
									colorScheme="blue"
									type="submit"
									form="formId"
									onClick={onClose}
								>
									Submit
								</Button>
							</ModalFooter>
						</ModalContent>
					</Modal>
					{/*
					<div className="bg-light-blue fw-bold font-color-blue btn-pill w-100 p-3 mt-4 text-center">
						Backlog
						<div className="row align-items-start m-4">
							{Array.from({ length: 3 }).map((_, index) => (
								<div className="col-4" key={index}>
									<div className=" bg-card rounded-5 p-4 card-shadow bg-white">
										<div className="card-body">
											<h6 className="card-subtitle mb-2 text-muted text-start">
												TS0001245
											</h6>
											<h5 className="card-title text-start text-black">
												UX sketches
											</h5>
										</div>
										<div className="card-footer bg-transparent border-0 d-flex justify-content-between align-items-center mt-3">
											<div className="d-flex align-items-center">
												<span className="badge rounded-pill bg-light text-dark me-4">
													4d
												</span>
												<Icon
													as={FaArrowUpLong}
													style={{ color: "#FFBD21", fontSize: "20px" }}
												/>
											</div>
											<img
												src={randomGuy}
												className="rounded-circle"
												alt="User"
												style={{ width: "30px", height: "30px" }}
											/>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
						*/}
				</div>
			</div>
		</div>
	);
}
