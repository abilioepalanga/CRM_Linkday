import "./ProjectPage.css";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import axios from "axios";
import {
	projectDetailsURL,
	projectsURL,
	participantsURL,
	tasksURL,
} from "../../apiRoutes";
import {
	FaRegCircle,
	FaRegCheckCircle,
	FaRegFlag,
	FaSave,
} from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { HiUserAdd } from "react-icons/hi";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Button,
	FormControl,
	FormLabel,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { IoMdAdd } from "react-icons/io";

import randomGuy from "../../assets/random_guy.jfif";

export default function ProjectPage() {
	const authHeader = useAuthHeader();
	const { projectId } = useParams(); // Get projectId from URL params
	const [project, setProject] = useState(null);
	const [progress, setProgress] = useState(0);
	const [users, setUsers] = useState([]);
	const [tasks, setTasks] = useState([]);
	const [isEditable, setIsEditable] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState(null);
	const [selectedPriority, setSelectedPriority] = useState(null);
	const [isUserOpen, setUserOpen] = useState(false);
	const [isTaskOpen, setTaskOpen] = useState(false);

	const onOpenUser = () => setUserOpen(true);
	const onCloseUser = () => setUserOpen(false);

	const onOpenTask = () => setTaskOpen(true);
	const onCloseTask = () => setTaskOpen(false);

	const [allUsers, setAllUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState();
	const [allTasks, setAllTasks] = useState([]);
	const [selectedTask, setSelectedTask] = useState();

	const openUserForm = () => {
		onOpenUser();
		axios
			.get(participantsURL, {
				headers: {
					Authorization: authHeader,
				},
			})
			.then((response) => {
				setAllUsers(response.data);
				console.log(response.data);
				console.log("________");
				console.log(allUsers);
				console.log(users);
			})
			.catch((error) => {
				console.error("There was an error!", error);
			});
	};

	const openTaskForm = () => {
		onOpenTask();
		axios
			.get(tasksURL, {
				headers: {
					Authorization: authHeader,
				},
			})
			.then((response) => {
				setAllTasks(response.data);
				console.log(response.data);
				console.log("________");
				console.log(allTasks);
				console.log(tasks);
			})
			.catch((error) => {
				console.error("There was an error!", error);
			});
	};

	useEffect(() => {
		fetchProjectDetails(projectId);
	}, [projectId]);

	const fetchProjectDetails = async (projectId) => {
		try {
			const url = projectDetailsURL(projectId);
			const response = await axios.get(url, {
				headers: {
					Authorization: authHeader,
				},
			});
			setProject(response.data.project);
			setUsers(response.data.users);
			setTasks(response.data.tasks);
			setSelectedStatus(response.data.project.state);
			setSelectedPriority(response.data.project.priority);

			console.log("Project details fetched:", response.data);

			const startDate = new Date(response.data.project.start_date);
			const deadline = new Date(response.data.project.deadline);
			const now = new Date();
			const totalDuration = deadline - startDate;
			const elapsedDuration = now - startDate;
			const progress = Math.round((elapsedDuration / totalDuration) * 100);
			setProgress(progress);
		} catch (error) {
			console.error("Error fetching project details:", error);
		}
	};

	const editProject = async () => {
		console.log("Edit project");
		if (isEditable) {
			const url = projectsURL + "/edit";
			const data = {
				id: projectId,
				name: document.getElementById("projectName").value,
				creator: document.getElementById("projectClient").value,
				state: document.querySelector('input[name="status"]:checked').value,
				priority: document.querySelector('input[name="prioridade"]:checked')
					.value,
			};
			try {
				const response = await axios.put(url, data, {
					headers: {
						Authorization: authHeader,
					},
				});
				console.log("Project edited:", response.data);
				setIsEditable(false);
			} catch (error) {
				console.error("Error editing project:", error);
			}
		} else {
			console.log("Edit project");
			setIsEditable(true);
		}
	};

	const addUser = (event) => {
		event.preventDefault();
		console.log("Add user");
		const newUser = { email: selectedUser.value, name: selectedUser.label };
		const url = projectsURL + "/edit/users";
		const data = {
			id: projectId,
			assigned_to: users.concat(newUser),
		};
		try {
			const response = axios.put(url, data, {
				headers: {
					Authorization: authHeader,
				},
			});
			console.log("User added:", response.data);
			setUsers(users.concat(newUser));
		} catch (error) {
			console.error("Error adding user:", error);
		}
	};

	const addTask = (event) => {
		event.preventDefault();
		console.log("Add task");
		const newTask = { title: selectedTask.label, id: selectedTask.value };
		const url = projectsURL + "/edit/tasks";
		const data = {
			id: projectId,
			tasks: tasks.concat(newTask),
		};
		try {
			const response = axios.put(url, data, {
				headers: {
					Authorization: authHeader,
				},
			});
			console.log("Task added:", response.data);
			setTasks(tasks.concat(newTask));
		} catch (error) {
			console.error("Error adding task:", error);
		}
	};

	const deleteTask = async (index) => {
		const url = projectsURL + "/edit/tasks";
		const data = {
			id: projectId,
			tasks: tasks.filter((t, i) => i !== index),
		};

		try {
			const response = await axios.put(url, data, {
				headers: {
					Authorization: authHeader,
				},
			});
			console.log("Task deleted:", response.data);
			setTasks(data.tasks);
		} catch (error) {
			console.error("Error deleting task:", error);
		}
	};

	if (!project) {
		return (
			<div className="container text-center m-0">
				<div className="row align-items-start">
					<div className="col">
						<div className="row align-items-start p-3">
							<h2 className="text-start font-color-blue fw-bold fs-1">
								A carregar...
							</h2>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container text-center m-0">
			<div className="row align-items-start">
				<div className="col">
					<div className="row align-items-start p-3">
						<h2 className="text-start font-color-blue fw-bold fs-1">
							{project.name}
						</h2>
					</div>
					<div className="row align-items-start p-3">
						<div className="col-3 card-shadow card-border m-2">
							<div className="row align-items-start justify-content-between mb-3 small-card-title">
								<div className="col-10">
									<h3 className="text-start fw-bold p-3">
										Informações básicas
									</h3>
								</div>
								<div className="col-2">
									<button
										className="mt-3"
										onClick={() => {
											editProject();
										}}
									>
										{isEditable ? <FaSave></FaSave> : <MdEdit></MdEdit>}
									</button>
								</div>
							</div>
							<form>
								<div className="form-floating mb-3">
									<input
										type="text"
										className="form-control small-input"
										id="projectName"
										placeholder=" "
										defaultValue={project.name}
										disabled={!isEditable}
									/>
									<label htmlFor="projectName">Nome do projeto</label>
								</div>
								<div className="form-floating mb-3">
									<input
										type="text"
										className="form-control small-input"
										id="projectClient"
										placeholder=" "
										defaultValue={"EDP"}
										disabled={true}
									/>
									<label htmlFor="projectClient">Cliente</label>
								</div>
								<div className="form-floating mb-3">
									<input
										type="text"
										className="form-control small-input"
										id="projectSupervisor"
										placeholder=" "
										defaultValue={project.creator}
										disabled={true}
									/>
									<label htmlFor="projectSupervisor">Responsável</label>
								</div>

								<div className="row m-3">
									<label className="form-label radio-label">Categoria</label>
									<div className="col-4 form-check">
										<input
											className="form-check-input"
											type="radio"
											name="categoria"
											value="Vendas"
											disabled={true}
										/>
										<label className="form-check-label radio-option">
											Vendas
										</label>
									</div>
									<div className="col-4 form-check">
										<input
											className="form-check-input"
											type="radio"
											name="categoria"
											value="Publicidade"
											disabled={true}
										/>
										<label className="form-check-label radio-option">
											Publicidade
										</label>
									</div>
									<div className="col-4 form-check">
										<input
											className="form-check-input"
											type="radio"
											name="categoria"
											value="Outros"
											checked={true}
											disabled={true}
										/>
										<label className="form-check-label radio-option">
											Outros
										</label>
									</div>
								</div>

								<div className="row m-3">
									<label className="form-label radio-label">Status</label>
									<div className="col form-check">
										<input
											className="form-check-input"
											type="radio"
											name="status"
											value="Em Desenvolvimento"
											checked={selectedStatus === "Em Desenvolvimento"}
											onChange={(e) => setSelectedStatus(e.target.value)}
											disabled={!isEditable}
										/>
										<label className="form-check-label radio-option">
											Em Desenvolvimento
										</label>
									</div>
									<div className="col form-check">
										<input
											className="form-check-input"
											type="radio"
											name="status"
											value="Pronto"
											checked={selectedStatus === "Pronto"}
											onChange={(e) => setSelectedStatus(e.target.value)}
											disabled={!isEditable}
										/>
										<label className="form-check-label radio-option">
											Pronto
										</label>
									</div>
									<div className="col form-check">
										<input
											className="form-check-input"
											type="radio"
											name="status"
											value="Parado"
											checked={selectedStatus === "Parado"}
											onChange={(e) => setSelectedStatus(e.target.value)}
											disabled={!isEditable}
										/>
										<label className="form-check-label radio-option">
											Parado
										</label>
									</div>
								</div>
								<div className="row m-3">
									<label className="form-label radio-label">Prioridade</label>
									<div className="col form-check">
										<input
											className="form-check-input"
											type="radio"
											name="prioridade"
											value="Baixo"
											checked={selectedPriority === "Baixo"}
											onChange={(e) => setSelectedPriority(e.target.value)}
											disabled={!isEditable}
										/>
										<label className="form-check-label radio-option">
											Baixa
										</label>
									</div>
									<div className="col form-check">
										<input
											className="form-check-input"
											type="radio"
											name="prioridade"
											value="Médio"
											checked={selectedPriority === "Médio"}
											onChange={(e) => setSelectedPriority(e.target.value)}
											disabled={!isEditable}
										/>
										<label className="form-check-label radio-option">
											Médio
										</label>
									</div>

									<div className="col form-check">
										<input
											className="form-check-input"
											type="radio"
											name="prioridade"
											value="Alto"
											checked={selectedPriority === "Alto"}
											onChange={(e) => setSelectedPriority(e.target.value)}
											disabled={!isEditable}
										/>
										<label className="form-check-label radio-option">
											Alta
										</label>
									</div>
								</div>
							</form>
						</div>
						<div className="col-5 card-shadow card-border m-2">
							<div className="row align-items-start mb-1 small-card-title ">
								<div className="col-11">
									<h3 className="text-startfw-bold p-3">Tarefas e Notas</h3>
								</div>
								<div className="col-1">
									<button className="mt-3" onClick={openTaskForm}>
										<IoMdAdd></IoMdAdd>
									</button>
								</div>
							</div>
							<div className="col">
								<div className="overflow-auto first-row-2">
									{tasks.map((task, index) => (
										<div
											key={index}
											className={`row align-items-start p-3 m-0 ${index !== 0 ? "border-top" : ""}`}
										>
											<div className="col-1">
												{task.status === "Done" ? (
													<FaRegCheckCircle style={{ color: "#001CAF" }} />
												) : (
													<FaRegCircle />
												)}
											</div>
											<div className="col-10 task-text">
												<span>{task.title}</span>
											</div>
											{/*
											<div className="col-1 p-0 text-end">
												<MdEdit style={{ color: "#001CAF" }}/>
											</div>
											*/}
											<div className="col-1 p-0 text-end">
												<button id={index} onClick={() => deleteTask(index)}>
													<MdDelete style={{ color: "#F91818" }} />
												</button>
											</div>
										</div>
									))}
									{tasks.map((task, index) => (
										<div
											key={index}
											className={`row align-items-start p-3 m-0 ${index !== 0 ? "border-top" : ""}`}
										>
											<div className="col-1">
												{task.status === "Done" ? (
													<FaRegCheckCircle style={{ color: "#001CAF" }} />
												) : (
													<FaRegCircle />
												)}
											</div>
											<div className="col-10 task-text">
												<span>{task.title}</span>
											</div>
											{/*
											<div className="col-1 p-0 text-end">
												<MdEdit style={{ color: "#001CAF" }}/>
											</div>
											*/}
											<div className="col-1 p-0 text-end">
												<button id={index} onClick={() => deleteTask(index)}>
													<MdDelete style={{ color: "#F91818" }} />
												</button>
											</div>
										</div>
									))}
								</div>
								<div className="row align-items-start p-3">
									<textarea
										className="form-control"
										placeholder="Notas"
									></textarea>
								</div>
							</div>
						</div>
						<div className="col-3 card-shadow card-border m-2">
							<div className="row align-items-start small-card-title">
								<div className="col-10">
									<h3 className="text-start  fw-bold p-3">Equipa</h3>
								</div>
								<div className="col-2 ">
									<button className="mt-3" onClick={openUserForm}>
										<HiUserAdd></HiUserAdd>
									</button>
								</div>
							</div>
							<div className="col overflow-auto first-row">
								{users.map((user, index) => (
									<div key={index} className="row p-3 border-bottom m-0">
										<div className="col-4">
											<img
												src={user.profilePicture || randomGuy}
												className="rounded-circle"
												alt="User"
												style={{ width: "40px", height: "40px" }}
											/>
										</div>
										<div className="col-8 d-flex align-items-center team-member">
											<h6 className="text-start">{user.name}</h6>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="row align-items-start p-3">
						<div className="col-11-5 card-shadow card-border m-2">
							<div className="row align-items-start">
								<h3 className="text-start small-card-title fw-bold p-3">
									Linha Temporal
								</h3>
							</div>
							<div className="row align-items-start p-3">
								<div className="col">
									<div className="row ps-4 timeline-text mb-1">
										<div className="col-11 p-0">
											{project.start_date} - {project.deadline}
										</div>
										<div className="col-1 pe-0">
											<FaRegFlag style={{ color: "#001CAF" }} />
										</div>
									</div>
									<div className="row progress p-0 h-100 rounded-left rounded-right">
										<div
											className="progress-bar p-0 h-100 "
											role="progressbar"
											style={{ width: `${progress}%` }}
											aria-valuemin="0"
											aria-valuemax="100"
										>
											<span className="p-2">{project.name}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/*
						<div className="col-3 card-shadow card-border m-2">
							<div className="row align-items-start">
								<h3 className="text-start small-card-title fw-bold p-3">
									Documentos
								</h3>
							</div>
							<div className="row align-items-start p-3">

							</div>

						</div>
						*/}
					</div>
				</div>
			</div>
			<Modal isOpen={isUserOpen} onClose={onCloseUser}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Adicionar Utilizador</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<form id="formId" onSubmit={addUser}>
							<FormControl mt={4}>
								<FormLabel>Atribuído a</FormLabel>

								<Select
									useBasicStyles
									placeholder="Select Assigned"
									value={selectedUser}
									onChange={(value) => {
										console.log(value);
										setSelectedUser(value);
									}}
									closeMenuOnSelect={false}
									options={allUsers
										.filter(
											(user) => !users.some((u) => u.email === user.email),
										)
										.map((user) => {
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
						<Button variant="ghost" mr={3} onClick={onCloseUser}>
							Fechar
						</Button>
						<Button
							colorScheme="blue"
							type="submit"
							form="formId"
							onClick={onCloseUser}
						>
							Submeter
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>

			<Modal isOpen={isTaskOpen} onClose={onCloseTask}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Adicionar Tarefas</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<form id="formId" onSubmit={addTask}>
							<FormControl mt={4}>
								<FormLabel>Tarefas</FormLabel>

								<Select
									useBasicStyles
									placeholder="Select Task"
									value={selectedTask}
									onChange={(value) => {
										console.log(value);
										setSelectedTask(value);
									}}
									closeMenuOnSelect={false}
									options={allTasks
										.filter((task) => !tasks.some((t) => t.id === task.id))
										.map((task) => {
											return {
												value: task.id,
												label: task.title,
											};
										})}
									hideSelectedOptions={false}
								/>
							</FormControl>
						</form>
					</ModalBody>

					<ModalFooter>
						<Button variant="ghost" mr={3} onClick={onCloseTask}>
							Fechar
						</Button>
						<Button
							colorScheme="blue"
							type="submit"
							form="formId"
							onClick={onCloseTask}
						>
							Submeter
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
