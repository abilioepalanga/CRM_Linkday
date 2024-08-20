import "./ProjectListPage.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { Box, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { projectsURL } from "../../apiRoutes";
import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	FormControl,
	FormLabel,
	Input,
	Select,
	useDisclosure,
} from "@chakra-ui/react";

export default function ProjectsListPage() {
	const authHeader = useAuthHeader();
	const [projects, setProjects] = useState([]);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();

	const toggleForm = () => {
		setIsFormOpen(!isFormOpen);
	};
	const handleNewProject = (event) => {
		event.preventDefault();
		const newProject = {
			name: event.target.name.value,
			start_date: event.target.start_date.value,
			deadline: event.target.deadline.value,
			priority: event.target.priority.value,
			state: event.target.state.value,
			assigned_to: [],
		};
		console.log(newProject);
		axios
			.post(`${projectsURL}/create`, newProject, {
				headers: {
					Authorization: authHeader,
				},
			})
			.then((response) => {
				setProjects([...projects, response.data]);
				toggleForm();
			})
			.catch((error) => {
				console.error("Failed to create project", error);
			});
	};

	useEffect(() => {
		fetchProjects();
	}, []); // Fetch projects when component mounts

	const handleRowClick = (projectId) => {
		// Redirect to the project details page using the project ID
		window.location.href = `/projects/${projectId}`;
	};

	const fetchProjects = () => {
		axios
			.get(projectsURL, {
				headers: {
					Authorization: authHeader,
				},
			})
			.then((response) => {
				setProjects(response.data);
			})
			.catch((error) => {
				console.error("Error fetching data:", error);
			});
	};

	return (
		<div className="container text-center mt-6">
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Novo Projeto</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<form id="formId" onSubmit={handleNewProject}>
							<FormControl id="name">
								<FormLabel>Nome do Projeto:</FormLabel>
								<Input type="text" name="name" required />
							</FormControl>

							<FormControl id="start_date" mt={4}>
								<FormLabel>Data de início:</FormLabel>
								<Input type="date" name="start_date" required />
							</FormControl>

							<FormControl id="deadline" mt={4}>
								<FormLabel>Data de fim:</FormLabel>
								<Input type="date" name="deadline" required />
							</FormControl>

							<FormControl id="priority" mt={4}>
								<FormLabel>Prioridade:</FormLabel>
								<Select placeholder="Seleciona uma opção" required>
									<option value="Baixo">Baixo</option>
									<option value="Médio">Médio</option>
									<option value="Alto">Alto</option>
								</Select>
							</FormControl>

							<FormControl id="state" mt={4}>
								<FormLabel>Estado:</FormLabel>
								<Select placeholder="Seleciona uma opção" required>
									<option value="Em Desenvolvimento">Em Desenvolvimento</option>
									<option value="Parado">Parado</option>
									<option value="Pronto">Pronto</option>
								</Select>
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
			<div className="row align-items-start">
				<div className="col">
					<div className="row align-items-start p-3">
						<div className="col-2">
							<h2 className="text-start font-color-blue fw-bold fs-1">
								Projetos
							</h2>
						</div>
						<div className="col-1">
							<button
								className="btn create-project-button float-end mt-2 me-4 p-2 w-100"
								onClick={onOpen}
							>
								+ Criar
							</button>
						</div>
					</div>
					<Box className="container text-center m-0">
						<Table
							variant="simple"
							style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}
						>
							<Thead>
								<Tr style={{ backgroundColor: "#1D37C4" }}>
									<Th
										style={{
											color: "#F9F9F9",
											fontSize: "23px",
											fontWeight: "500",
											lineHeight: "20px",
											textAlign: "center",
											borderLeft: "1px solid #F9F9F9",
											borderTopLeftRadius: "10px",
										}}
									>
										Nome do Projeto
									</Th>
									<Th
										style={{
											color: "#F9F9F9",
											fontSize: "23px",
											fontWeight: "500",
											lineHeight: "20px",
											textAlign: "center",
											borderLeft: "1px solid #F9F9F9",
											borderRight: "0.5px solid #FFFFFF",
										}}
									>
										Criador
									</Th>
									<Th
										style={{
											color: "#F9F9F9",
											fontSize: "23px",
											fontWeight: "500",
											lineHeight: "20px",
											textAlign: "center",
											borderLeft: "1px solid #F9F9F9",
											borderRight: "0.5px solid #FFFFFF",
										}}
									>
										Estado
									</Th>
									<Th
										style={{
											color: "#F9F9F9",
											fontSize: "23px",
											fontWeight: "500",
											lineHeight: "20px",
											textAlign: "center",
											borderLeft: "1px solid #F9F9F9",
											borderRight: "0.5px solid #FFFFFF",
										}}
									>
										Prazo
									</Th>
									<Th
										style={{
											color: "#F9F9F9",
											fontSize: "23px",
											fontWeight: "500",
											lineHeight: "20px",
											textAlign: "center",
											borderLeft: "1px solid #F9F9F9",
											borderRight: "0.5px solid #FFFFFF",
											borderTopRightRadius: "10px",
										}}
									>
										Prioridade
									</Th>
								</Tr>
							</Thead>
							<Tbody>
								{projects.map((project) => (
									<Tr
										key={project.id}
										className="hovered-row"
										onClick={() => handleRowClick(project.id)}
									>
										<Td
											style={{
												borderTop: "0.5px solid #bfc1cc",
												borderBottom: "0.5px solid #bfc1cc",
												borderRight: "0.5px solid #bfc1cc",
												textAlign: "center",
											}}
										>
											{project.name}
										</Td>
										<Td
											style={{
												borderTop: "0.5px solid #bfc1cc",
												borderBottom: "0.5px solid #bfc1cc",
												borderLeft: "0.5px solid #bfc1cc",
												borderRight: "0.5px solid #bfc1cc",
												textAlign: "center",
											}}
										>
											{project.creator}
										</Td>
										<Td
											style={{
												borderTop: "0.5px solid #bfc1cc",
												borderBottom: "0.5px solid #bfc1cc",
												borderLeft: "0.5px solid #bfc1cc",
												borderRight: "0.5px solid #bfc1cc",
												textAlign: "center",
											}}
										>
											<div
												className={`${project.state === "Pronto" ? "bg-done text-done" : project.state === "Parado" ? "bg-stopped text-stopped" : "bg-in-development text-in-development"} rounded-4 text-center p-2 ps-4 pe-4`}
											>
												{project.state}
											</div>
										</Td>
										<Td
											style={{
												borderTop: "0.5px solid #bfc1cc",
												borderBottom: "0.5px solid #bfc1cc",
												borderLeft: "0.5px solid #bfc1cc",
												borderRight: "0.5px solid #bfc1cc",
												textAlign: "center",
											}}
										>
											{project.deadline}
										</Td>
										<Td
											style={{
												borderTop: "0.5px solid #bfc1cc",
												borderBottom: "0.5px solid #bfc1cc",
												borderLeft: "0.5px solid #bfc1cc",
											}}
										>
											<div
												className={`${project.priority === "Alto" ? "bg-stopped text-stopped" : project.priority === "Médio" ? "bg-in-development text-in-development" : "bg-done text-done"} rounded-4 text-center p-2 ps-4 pe-4`}
											>
												{project.priority}
											</div>
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</Box>
				</div>
			</div>
		</div>
	);
}
